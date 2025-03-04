import { NextFunction, Response } from "express";
import {
  createTaskSchema,
  deleteTaskSchema,
  DeleteTaskType,
  getTasksSchema,
  GetTaskType,
  updateTaskSchema,
  UpdateTaskType,
} from "../lib/validations/task";
import { db } from "../db";
import { AddTaskType, task } from "../db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import httpErrors from "http-errors";
import { IRequest } from "../lib/types";
import { status } from "http-status";

export default class TaskController {
  async createTask(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await createTaskSchema.parseAsync(req.body);

      const userId = req.user?.id!;

      const insertValues: AddTaskType = {
        title: data.title,
        priority: data.priority,
        deadline: data.deadline,
        description: data.description,
        userId,
      };

      const doesTaskExist = await db
        .select()
        .from(task)
        .where(
          and(eq(task.userId, userId), eq(task.title, insertValues.title)),
        );

      if (doesTaskExist.length !== 0) {
        throw httpErrors.Conflict(
          `You already created a task with Title [${insertValues.title}]`,
        );
      }

      const newTask = await db.insert(task).values(insertValues).returning();

      res.status(status.CREATED).json({
        task: newTask,
        message: "Successfully created a new task",
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await getTasksSchema.parseAsync(req.body);

      const userId = req.user?.id!;

      const query: GetTaskType = {
        task_id: data.task_id,
        search: data.search,
        priority: data.priority,
      };

      const tasks = await db
        .select()
        .from(task)
        .where(
          and(
            eq(task.userId, userId),
            or(
              query.task_id ? eq(task.id, query.task_id) : undefined,
              query.search
                ? or(
                    ilike(task.title, query.search),
                    ilike(task.title, query.search),
                  )
                : undefined,
              query.priority ? eq(task.priority, query.priority) : undefined,
            ),
          ),
        );

      res.status(status.OK).json({
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await updateTaskSchema.parseAsync(req.body);

      const userId = req.user?.id!;

      const updateValues: UpdateTaskType = {
        priority: data.priority,
        deadline: data.deadline,
        task_id: data.task_id,
      };

      const taskObj = await db
        .select()
        .from(task)
        .where(and(eq(task.id, updateValues.task_id), eq(task.userId, userId)));

      if (taskObj.length === 0) {
        throw httpErrors.BadRequest(
          `Task with id [${updateValues.task_id}] does not exist`,
        );
      }

      await db
        .update(task)
        .set(updateValues)
        .where(and(eq(task.id, updateValues.task_id), eq(task.userId, userId)));

      res.status(status.OK).json({ message: "Task updated successfully." });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await deleteTaskSchema.parseAsync(req.body);

      const deleteValues: DeleteTaskType = { task_id: data.task_id };

      const userId = req.user?.id!;

      const tasks = await db
        .select()
        .from(task)
        .where(and(eq(task.id, deleteValues.task_id), eq(task.userId, userId)));
      if (tasks.length === 0) {
        throw httpErrors.BadRequest(
          `Task with id [${deleteValues.task_id}] does not exist`,
        );
      }
      await db
        .delete(task)
        .where(and(eq(task.id, deleteValues.task_id), eq(task.userId, userId)));

      res.status(status.OK).json({ message: "Successfully deleted record" });
    } catch (error) {
      next(error);
    }
  }
}
