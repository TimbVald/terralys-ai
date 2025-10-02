"use client"
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

const ProfileView: React.FC = () => {
  const { data, isPending, refetch } = authClient.useSession();
  const user = data?.user;
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trpc = useTRPC();
  const updateProfile = useMutation<any, any, { name: string; image?: string }>(
    trpc.profile.update.mutationOptions({
      onSuccess: () => {
        setPending(false);
        setSuccess('Profil mis à jour !');
        refetch?.();
      },
      onError: () => {
        setPending(false);
        setError('Erreur lors de la mise à jour');
      },
    })
  );

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setSuccess(null);
    setError(null);
    updateProfile.mutate({ name, image });
  }

  if (isPending) return <div>Chargement...</div>;
  if (!user) return <div>Non connecté</div>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2>Profil utilisateur</h2>
      <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Nom :
          <input value={name} onChange={e => setName(e.target.value)} disabled={pending} />
        </label>
        <label>
          Email :
          <input value={user.email} disabled />
        </label>
        <label>
          Avatar (URL) :
          <input value={image} onChange={e => setImage(e.target.value)} disabled={pending} />
        </label>
        <button type="submit" disabled={pending}>Mettre à jour</button>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
  Créé le : {new Date(user.createdAt).toLocaleString()}<br />
  Modifié le : {new Date(user.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ProfileView;
