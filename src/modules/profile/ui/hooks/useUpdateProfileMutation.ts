// Utilitaire pour exposer les mutationOptions pour profile.update
import { useTRPC } from '@/trpc/client';
import { UseMutationOptions } from '@tanstack/react-query';

export function useUpdateProfileMutation(
  options?: UseMutationOptions<any, any, { name: string; image?: string }>
) {
  const trpc = useTRPC();
  // On suppose que mutationOptions existe sur la procédure côté client
  return trpc.profile.update.mutationOptions(options);
}
