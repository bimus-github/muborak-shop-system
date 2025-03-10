import { connect } from "@/database/config";
import roomModel from "@/models/roomModel";
import { LangFormat, Room } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const roomId = params.id;
    // console.log(userId, roomId);

    const room: Room | null = await roomModel.findOne({
      id: roomId,
      userId: userId,
    });

    if (!room) {
      const newRoom: Room = await roomModel.create({
        id: roomId,
        userId: userId,
        saledProducts: [],
      });

      return NextResponse.json(
        { room: newRoom, success: true },
        { status: 201 }
      );
    }

    return NextResponse.json({ room, success: true }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      en: `An error occurred: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
    };

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const roomId = params.id;
    const room: Room = await req.json();
    // console.log(room);

    const updatedRoom = await roomModel.findOneAndUpdate(
      { id: room.id, userId: userId },
      room
    );
    // console.log(updatedRoom);

    if (!updatedRoom) {
      const newRoom = await roomModel.create({
        ...room,
        userId,
        id: roomId,
      });

      return NextResponse.json(
        { room: newRoom, success: true },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { room: updatedRoom, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      en: `An error occurred: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
    };

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const roomId = params.id;

    const deletedRoom = await roomModel.findOneAndDelete({
      id: roomId,
      userId: userId,
    });

    return NextResponse.json(
      { room: deletedRoom, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      en: `An error occurred: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
    };

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};
