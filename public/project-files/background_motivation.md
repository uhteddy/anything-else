# Anything Else: Background and Motivation

COMP 4110 · Software Engineering I · Fall 2026 · Team 3
Cassie Manning · David Suy · Samuel Pimentel · Senghak Heng · Teddy Hartling

## Overview

Anything Else is a web-based classroom game for live, group-based review sessions. An instructor builds a set of questions and hosts a game. Students join from their own phones or laptops by entering a game PIN, with no account needed. The system randomly sorts students into small groups, each identified by a color. Students find their groupmates by holding up their screens, then work together to answer each question in their own words.

Answers are open response, not multiple choice. Each group answer is graded by Jev (Typesafe AI), an AI grading service that compares it to a reference answer the instructor wrote. Jev decides whether the answer is correct and how complete it is. A fully correct answer earns full credit. A correct but vague or incomplete answer earns partial credit. Faster answers earn more points, and a leaderboard after each question keeps the session competitive.

## Background

Live quiz games such as Kahoot! have become a common part of classroom teaching. The model is familiar: the instructor projects a question, students answer on their own devices, points reward speed and accuracy, and a leaderboard creates excitement. These tools work well for engagement and are easy for instructors to adopt.

Most of these tools share two design choices that limit what they can measure:

1. **Answers are multiple choice.** Students pick from options rather than producing an answer. This tests recognition rather than recall, lets students guess correctly without understanding, and can't tell apart a student who understands the concept from one who eliminated the wrong options. Questions that ask why or how (explanations, reasoning, cause and effect) don't fit a multiple-choice format well.
2. **Play is individual.** Each student competes alone, usually against the whole class. Students who are behind tend to fall further down the leaderboard and disengage. The format doesn't encourage students to explain ideas to each other, even though discussing a problem with peers is one of the most effective ways to learn it.

Instructors who want open-ended answers in a live setting have had no practical option. Reading and grading dozens of written answers by hand takes too long for a live game, where the class expects results within seconds. That's why live quiz tools have stayed with multiple choice: it's the only format a computer could grade instantly.

## Motivation

Recent AI language models make it possible to grade short written answers against a reference answer in seconds. That removes the main reason live quiz games are limited to multiple choice. This project uses that capability to build a live quiz game around two ideas the existing tools don't support:

**1. Open-response answers with partial credit.** Students explain their answer in their own words. Jev grades each answer on two dimensions: whether it's correct, and how complete or accurate it is. An answer that is right but missing key context earns some points instead of all or nothing. This rewards real understanding, makes guessing far less useful, and lets instructors use the "why" and "how" questions that best show whether students understand the material.

**2. Collaborative group play.** Students answer as groups, not individuals. Groups are assigned randomly, so students work with classmates outside their usual circle, and the color-based grouping turns forming groups into a quick, physical activity. Each group submits one answer per question. That means members have to discuss the question, agree on an explanation and write it together, which is the kind of peer discussion that helps students learn. Students who are struggling get help from their group instead of falling behind alone.

The game keeps what makes live quizzes engaging: time pressure, speed bonuses and a leaderboard. The thinking behind the answers moves from picking an option to building an explanation.

The system also gives instructors better information. After each game, the instructor can review every group's written answer, Jev's verdict and the points awarded. Written answers show how students are reasoning and which misconceptions are common, which multiple-choice results can't reveal.

## How It Works

1. **Prepare.** The instructor logs in and creates a question set. Each question has a prompt (text, an image, or both), a reference answer and a time limit.
2. **Host.** The instructor starts a game from a question set and picks a group size. The system creates a game PIN and opens a lobby.
3. **Join.** Students go to the join page on their own devices, enter the PIN and choose a username. No account or app install is needed.
4. **Group.** The instructor assigns groups. The system splits students into groups of the chosen size and gives each a color. Each student's screen fills with their group's color and color name, so groupmates can spot each other across the room.
5. **Play.** For each question, the prompt and a countdown appear on the projected screen and every device. Any member of a group can submit the group's answer, and the first submission counts.
6. **Grade.** Jev grades each answer against the reference answer. Points depend on correctness, completeness and speed.
7. **Review.** After each question, the class sees the reference answer, each group's points and the leaderboard. At the end, the final leaderboard marks the top three groups, and the instructor can review every answer in detail.

## Goals

- Let instructors run live review sessions built on open-ended questions, not just multiple choice.
- Grade written answers automatically and quickly enough for live play, with partial credit for incomplete answers.
- Encourage collaboration and discussion through randomly assigned groups.
- Keep the engagement of existing live quiz games: timing, scoring and a leaderboard.
- Make joining easy: any modern browser on a phone or laptop, with no student accounts.
- Give instructors detailed results that show how students reason, not just whether they got the right answer.

## Stakeholders and Users

- **Instructors:** the primary users and the people choosing to adopt the system. They create question sets, host games and review results. They need setup to be fast, grading to be fair, and to stay in control of the game.
- **Students:** play the game in groups on their own devices. They need joining to be simple, the screens to be clear, and scoring that feels fair and understandable.
- **Jev (Typesafe AI):** the outside grading service. The system depends on it being available, fast and consistent.
- **The development team (Team 3):** responsible for building and maintaining the system within the COMP 4110 semester.

## Scope

**In scope:**

- Instructor accounts.
- Creating and editing question sets, including image prompts.
- Hosting live games.
- Joining by PIN with no student accounts.
- Random color-based group assignment.
- Timed open-response questions.
- AI grading with partial credit.
- Speed-based scoring and leaderboards.
- Reviewing results after a game.

**Out of scope for this version:**

- Multiple-choice or other question types.
- Self-paced or homework games played outside a live session.
- Student accounts and progress tracked across games.
- Connecting to learning management systems or gradebooks.
- Native mobile apps.

## Assumptions and Risks

- **AI grading accuracy.** Grading quality depends on Jev and on how clearly the instructor writes the reference answer. Jev may misjudge an answer, especially an unusual but valid one. The system reduces this risk by letting the instructor override any grade and by showing every answer for review.
- **Service availability.** If Jev is slow or unavailable, grading stalls. The system lets the instructor grade an answer manually if Jev doesn't respond within a set time.
- **Fairness within groups.** Since one member submits for the whole group, a single student could dominate. The group format is meant to encourage discussion, but the team should watch how this works in practice.
- **Class size.** The number of distinct group colors limits how many groups a game can have. Very large classes need larger groups.
- **Device access.** The system assumes most students have a phone or laptop. Because groups share one answer, a group still works if some members don't have a device.
