import type { CreateCardInput, UpdateCardInput } from '@bb/core';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { cardKeys } from './keys';

export interface CardMutations {
  create: UseMutationResult<void, Error, CreateCardInput>;
  update: UseMutationResult<void, Error, UpdateCardInput>;
  remove: UseMutationResult<void, Error, string>;
}

export function useCardMutations(): CardMutations {
  const { cardsGateway } = useServices();
  const queryClient = useQueryClient();

  const invalidate = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: cardKeys.all });
  };

  const create = useMutation({
    mutationFn: (input: CreateCardInput) => cardsGateway.create(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (input: UpdateCardInput) => cardsGateway.update(input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (cardId: string) => cardsGateway.remove(cardId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
