import { Alert } from '../../../ui';
import type { UserEventActionsController } from '../hooks/useUserEventActions';

type UserEventFeedbackProps = {
  controller: UserEventActionsController;
  className?: string;
};

export function UserEventFeedback({ controller, className }: UserEventFeedbackProps) {
  const { feedback } = controller;
  if (feedback === null) {
    return null;
  }

  return (
    <Alert variant={feedback.tone} title={feedback.title} className={className}>
      {feedback.message}
    </Alert>
  );
}
