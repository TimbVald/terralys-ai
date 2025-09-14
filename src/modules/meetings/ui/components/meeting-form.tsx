import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient()

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false)
    const [agentSearch, setAgentSearch] = useState("")

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        })
    )

    const createMeeting = useMutation(
        trpc.meeting.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meeting.getMany.queryOptions({}),
                );
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions(),
                );
                onSuccess?.(data.id)
            },
            onError: (error) => {
                toast.error(error.message);

                 if (error.data?.code === "FORBIDDEN") {
                    router.push("/upgrade");
                }
            }
        })
    )

    const updateMeeting = useMutation(
        trpc.meeting.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meeting.getMany.queryOptions({}),
                )

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meeting.getOne.queryOptions({
                            id: initialValues.id,
                        }),
                    )
                }
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof meetingInsertSchema>>({
        resolver: zodResolver(meetingInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? "",
        },
    })

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({
                id: initialValues.id,
                ...values,
            })
        } else {
            createMeeting.mutate(values)
        }
    }

    return (
        <>
            <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Meeting Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. My Consultation of Plant Disease"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    name="agentId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Agent Name
                            </FormLabel>
                            <FormControl>
                                <CommandSelect
                                    options={(agents.data?.items ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar
                                                    className="border h-6 w-6"
                                                    seed={agent.name}
                                                    variant="botttsNeutral"
                                                />
                                                <span className="text-sm font-medium">
                                                    {agent.name}
                                                </span>
                                            </div>
                                        ),
                                    })) ?? []}
                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    placeholder="Search an agent"
                                />
                            </FormControl>
                            <FormDescription>
                                Not founud what you're looking for ? {" "}
                                <button type="button" className="text-primary hover:underline" onClick={() => setOpenNewAgentDialog(true)}>
                                    Create new agent
                                </button>
                            </FormDescription>

                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button onClick={onCancel} variant="outline" type="button" disabled={isPending}>
                            {isPending ? "Cancelling..." : "Cancel"}
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
        </>
    )
}
