"use client";

import { useActionState } from "react";
import { deleteWebhookAction, registerWebhookAction } from "@/actions/webhooks";
import { Button } from "@/components/ui/button";

type ActionState = {
  success: boolean;
  message: string;
  webhookUrl?: string;
} | null;

export function WebhookInitButton() {
  const [registerState, registerAction, isRegistering] = useActionState<ActionState, FormData>(
    registerWebhookAction,
    null
  );
  const [deleteState, deleteAction, isDeleting] = useActionState<ActionState, FormData>(
    deleteWebhookAction,
    null
  );

  return (
    <div>
      <form action={registerAction} className="flex flex-col gap-3">
        <input
          name="webhookUrl"
          placeholder="https://your-domain.com/api/webhooks/kira-pay"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={isRegistering}>
          {isRegistering ? "Registering..." : "Register Webhook"}
        </Button>
      </form>
      {registerState?.message ? (
        <p
          className={`mt-2 text-xs sm:text-sm ${
            registerState.success ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {registerState.message}
        </p>
      ) : null}

      {registerState?.success ? (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground truncate">
            {registerState.webhookUrl}
          </span>
          <form action={deleteAction}>
            <Button type="submit" variant="outline" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Webhook"}
            </Button>
          </form>
        </div>
      ) : null}

      {deleteState?.message ? (
        <p
          className={`mt-2 text-xs sm:text-sm ${
            deleteState.success ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {deleteState.message}
        </p>
      ) : null}
    </div>
  );
}
