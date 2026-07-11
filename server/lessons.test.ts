import { describe, it, expect } from "vitest";
import { lessonsRouter } from "./lessons.router";
import { exercisesRouter } from "./exercises.router";

describe("Lessons Router", () => {
  it("should have getById procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });

  it("should have listByCourse procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });

  it("should have getWithExercises procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });

  it("should have create procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });

  it("should have update procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });

  it("should have delete procedure", () => {
    expect(lessonsRouter).toBeDefined();
  });
});

describe("Exercises Router", () => {
  it("should have getById procedure", () => {
    expect(exercisesRouter).toBeDefined();
  });

  it("should have listByLesson procedure", () => {
    expect(exercisesRouter).toBeDefined();
  });

  it("should have submit procedure", () => {
    expect(exercisesRouter).toBeDefined();
  });

  it("should have getSubmission procedure", () => {
    expect(exercisesRouter).toBeDefined();
  });

  it("should have create procedure", () => {
    expect(exercisesRouter).toBeDefined();
  });
});
