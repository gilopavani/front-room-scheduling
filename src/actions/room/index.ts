"use server";
import { CreateRoomSchema, NewRoomResponse } from "@/models/room.model";

import { createRoomService } from "@/service/room";

export async function createRoomAction(
  data: CreateRoomSchema
): Promise<NewRoomResponse> {
  const { number, startTime, endTime, timeBlock } = data;

  if (!number || !startTime || !endTime || !timeBlock) {
    throw new Error("Dados inválidos para criar a sala");
  }

  return await createRoomService({
    number,
    startTime,
    endTime,
    timeBlock,
  });
}
