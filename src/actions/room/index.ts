"use server";
import {
  CreateRoomSchema,
  NewRoomResponse,
  RoomSchema,
  roomSchema,
} from "@/models/room.model";

import { createRoomService, editRoomService } from "@/service/room";

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
