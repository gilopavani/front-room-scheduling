import api from "@/lib/api";
import {
  roomModel,
  NewRoomResponse,
  RoomListResponse,
} from "@/models/room.model";

export async function getRoomsService(): Promise<RoomListResponse> {
  const response = await api.get<RoomListResponse>("/room");
  return response.data;
}
export async function createRoomService(
  roomData: Omit<roomModel, "id" | "createdAt" | "updatedAt">
): Promise<NewRoomResponse> {
  const response = await api.post<NewRoomResponse>("/room", roomData);
  return response.data;
}

export async function editRoomService(
  roomId: string,
  roomData: Omit<roomModel, "id" | "createdAt" | "updatedAt">
): Promise<NewRoomResponse> {
  const response = await api.patch<NewRoomResponse>(
    `/room/${roomId}`,
    roomData
  );
  return response.data;
}
