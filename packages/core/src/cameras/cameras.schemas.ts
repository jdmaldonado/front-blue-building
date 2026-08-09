import { z } from 'zod';
import { IdSchema } from '../shared';

export const CamStreamSubscriptionSchema = z.object({
  buildingId: IdSchema,
  camId: IdSchema,
});
export type CamStreamSubscription = z.infer<typeof CamStreamSubscriptionSchema>;
