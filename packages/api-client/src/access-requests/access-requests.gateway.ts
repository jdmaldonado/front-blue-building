import {
  AccessRequestSchema,
  AccessRequestsResponseSchema,
  type AccessRequestList,
  type ApprovalScope,
  type ResolveAccessRequestInput,
} from '@bb/core';
import type { Logger } from '@bb/logger';
import type { HttpClient } from '../http';
import { readRows } from '../shared';
import { toAccessRequestsError } from './access-requests.errors';
import { accessRequestsPath, resolveAccessRequestPath } from './access-requests.paths';

export class AccessRequestsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  async list(scope: ApprovalScope, spaceId: string): Promise<AccessRequestList> {
    const path = accessRequestsPath(scope, spaceId);
    try {
      const raw = await this.http.get({ path });
      const { accessRequests } = AccessRequestsResponseSchema.parse(raw);
      const { items, skipped } = readRows(accessRequests, AccessRequestSchema, {
        logger: this.logger,
        path,
        label: 'Access request',
      });
      return { requests: items, skipped };
    } catch (error) {
      throw toAccessRequestsError(error);
    }
  }

  // The old app also sent `apartmentId`, which the API drops on the floor
  // (api/src/controllers/buildings/access/apartment_access_form.ts:6-10): the
  // apartment comes from the request itself.
  async resolve(input: ResolveAccessRequestInput): Promise<void> {
    try {
      await this.http.post({
        path: resolveAccessRequestPath(input.scope, input.spaceId, input.requestId),
        body: { approved: input.approved },
      });
    } catch (error) {
      throw toAccessRequestsError(error);
    }
  }
}
