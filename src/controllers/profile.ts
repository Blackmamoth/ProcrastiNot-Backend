import { NextFunction, Response } from "express";
import { IRequest } from "../lib/types";
import {
  addProfileSchema,
  updateProfileSchema,
  UpdateProfileType,
} from "../lib/validations/profile";
import { db } from "../db";
import { AddProfileType, profile } from "../db/schema";
import status from "http-status";
import { eq } from "drizzle-orm";
import httpErrors from "http-errors";

export default class ProfileController {
  async addProfile(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await addProfileSchema.parseAsync(req.body);

      const userId = req.user?.id!;

      const doesProfileExist = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, userId));

      if (doesProfileExist.length !== 0) {
        throw httpErrors.UnprocessableEntity(
          "Your profile already exists, you can only update your profile details once created.",
        );
      }

      const insertValues: AddProfileType = {
        age: data.age,
        background: data.background,
        currentRoutine: data.currentRoutine,
        mainGoal: data.mainGoal,
        motivation: data.motivation,
        procrastinationTriggers: data.procrastinationTriggers,
        userId: userId,
      };

      const newProfile = await db
        .insert(profile)
        .values(insertValues)
        .returning();

      res.status(status.CREATED).json({
        profile: newProfile,
        message: "Your profiled details were successfully saved",
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id!;

      const userProfile = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, userId));

      if (userProfile.length === 0) {
        throw httpErrors.BadRequest(
          "The profile you're trying to fetch does not exist.",
        );
      }

      res.status(status.OK).json({
        profile: userProfile[0],
        message: "Your profile details were successfully received",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await updateProfileSchema.parseAsync(req.body);

      const userId = req.user?.id!;

      const userProfile = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, userId));
      if (userProfile.length === 0) {
        throw httpErrors.BadRequest(
          "Your profile doesn't exist, you need to add your profile details before updating them",
        );
      }

      let updateValues: UpdateProfileType = {
        motivation: data.motivation,
        age: data.age,
        background: data.background,
        currentRoutine: data.currentRoutine,
        mainGoal: data.mainGoal,
        procrastinationTriggers: data.procrastinationTriggers,
      };

      await db
        .update(profile)
        .set(updateValues)
        .where(eq(profile.userId, userId));

      res
        .status(status.OK)
        .json({ message: "Your profile details were updated", updateValues });
    } catch (error) {
      next(error);
    }
  }
}
