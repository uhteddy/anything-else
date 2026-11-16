import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Background and Description"
        description="How Anything Else combines fast-paced live classroom review with collaborative open-response AI grading."
      />

      <ArcadeCard accentColor="bg-primary" accentSize="sm" bodyClassName="gap-3 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Overview</h2>
        <p className="text-base leading-relaxed">
          Anything Else is a browser-based game for live, group review sessions.
          Instructors prepare question sets and host games; students join from a
          phone or laptop with a game PIN, without creating an account. Students
          are assigned to color-coded groups and work together to submit
          open-response answers.
        </p>
        <p className="text-base leading-relaxed">
          The grading service Jev (Typesafe AI) compares each group&apos;s
          response with the instructor&apos;s reference answer. Groups can earn
          full or partial credit based on correctness and completeness, with
          faster answers earning more points. A leaderboard keeps the session
          engaging, while written responses give instructors insight into how
          students are thinking.
        </p>
      </ArcadeCard>

      <ArcadeCard accentColor="bg-secondary" accentSize="sm" bodyClassName="gap-3 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Background and Motivation</h2>
        <p className="text-base leading-relaxed">
          Live quiz tools such as Kahoot! make classroom review engaging with
          timed questions, individual competition, and leaderboards. However,
          multiple-choice questions mainly measure recognition, allow
          guessing, and are not well suited to questions asking students to
          explain why or how. Individual competition can also leave students
          who fall behind disengaged, without encouraging peer discussion.
        </p>
        <p className="text-base leading-relaxed">
          Open-ended answers are difficult to use in a fast-paced classroom
          game because manually grading many written responses takes too long.
          Recent language models make it practical to compare short answers
          with instructor-provided references in seconds, enabling a live game
          built around both written reasoning and teamwork.
        </p>
        <ul className="list-disc space-y-2 ps-6 text-base">
          <li>
            <strong>Open responses with partial credit:</strong> Students
            explain ideas in their own words. Jev evaluates correctness and
            completeness, so a valid but incomplete answer can receive partial
            credit rather than being marked simply right or wrong.
          </li>
          <li>
            <strong>Collaborative play:</strong> Students are randomly grouped
            and submit one agreed-upon answer per group. This encourages
            discussion and gives students a chance to learn from one another.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          The game retains the time pressure, speed bonuses, and leaderboard of
          familiar quiz games, while giving instructors written answers and
          grading results to review after play.
        </p>
      </ArcadeCard>

      <ArcadeCard accentColor="bg-accent" accentSize="sm" bodyClassName="gap-3 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">How It Works</h2>
        <ol className="list-decimal space-y-2 ps-6 text-base">
          <li>
            <strong>Prepare:</strong> The instructor creates a question set.
            Each question can include text or an image, a reference answer, and
            a time limit.
          </li>
          <li>
            <strong>Host:</strong> The instructor selects a question set and
            group size. The game opens a lobby with a PIN.
          </li>
          <li>
            <strong>Join:</strong> Students enter the PIN and choose a username
            from their own devices; no student account or app is required.
          </li>
          <li>
            <strong>Group:</strong> Students are randomly sorted into
            color-coded groups, making it easy to find groupmates.
          </li>
          <li>
            <strong>Play:</strong> Each question and its countdown appear on
            the projected screen and student devices. Any group member can
            submit the group&apos;s answer, and the first submission counts.
          </li>
          <li>
            <strong>Grade:</strong> Jev compares each response with the
            reference answer. Points reflect correctness, completeness, and
            response speed.
          </li>
          <li>
            <strong>Review:</strong> The class sees the reference answer,
            group scores, and leaderboard. The instructor can review answers
            and results after the game.
          </li>
        </ol>
      </ArcadeCard>

      <div className="grid gap-6 md:grid-cols-2">
        <ArcadeCard accentColor="bg-info" accentSize="sm" bodyClassName="gap-3 p-6">
          <h2 className="card-title text-2xl font-black">Goals</h2>
          <ul className="list-disc space-y-2 ps-6 text-base">
            <li>Support live review with open-ended questions and written answers.</li>
            <li>Grade quickly enough for live play, including partial credit.</li>
            <li>Encourage collaboration through randomly assigned groups.</li>
            <li>Keep sessions engaging with timed questions, scoring, and a leaderboard.</li>
            <li>Make joining easy from a modern phone or laptop browser.</li>
            <li>Give instructors results that reveal student reasoning and misconceptions.</li>
          </ul>
        </ArcadeCard>

        <ArcadeCard accentColor="bg-primary" accentSize="sm" bodyClassName="gap-3 p-6">
          <h2 className="card-title text-2xl font-black">Stakeholders and Users</h2>
          <ul className="list-disc space-y-2 ps-6 text-base">
            <li>
              <strong>Instructors</strong> create question sets, host games, and
              review results. They need quick setup, fair grading, and control
              over the session.
            </li>
            <li>
              <strong>Students</strong> join on their devices and play in groups.
              They need a simple joining flow, clear screens, and understandable
              scoring.
            </li>
            <li>
              <strong>Jev (Typesafe AI)</strong> provides automated answer
              grading; the game depends on its availability, speed, and
              consistency.
            </li>
            <li>
              <strong>The development team</strong> builds and maintains the
              project during the COMP 4110 semester.
            </li>
          </ul>
        </ArcadeCard>
      </div>

      <ArcadeCard accentColor="bg-secondary" accentSize="sm" bodyClassName="gap-4 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Project Scope</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-box border-2 border-base-300 bg-base-200 p-4">
            <h3 className="mb-2 text-lg font-black">In Scope</h3>
            <ul className="list-disc space-y-1 ps-6 text-base">
              <li>Instructor accounts and editable question sets, including image prompts</li>
              <li>PIN-based live games without student accounts</li>
              <li>Random, color-based groups</li>
              <li>Timed open-response questions</li>
              <li>AI grading with partial credit, speed scoring, and leaderboards</li>
              <li>Post-game answer and result review</li>
            </ul>
          </div>
          <div className="rounded-box border-2 border-base-300 bg-base-200 p-4">
            <h3 className="mb-2 text-lg font-black">Out of Scope</h3>
            <ul className="list-disc space-y-1 ps-6 text-base">
              <li>Multiple-choice or other question types</li>
              <li>Self-paced or homework games</li>
              <li>Student accounts or progress tracking across games</li>
              <li>Learning management system or gradebook integrations</li>
              <li>Native mobile apps</li>
            </ul>
          </div>
        </div>
      </ArcadeCard>

      <ArcadeCard accentColor="bg-accent" accentSize="sm" bodyClassName="gap-3 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Assumptions and Risks</h2>
        <ul className="list-disc space-y-2 ps-6 text-base">
          <li>
            <strong>Grading accuracy:</strong> Jev may misjudge unusual but
            valid answers, and results depend on clear reference answers.
            Instructors can override grades and review every response.
          </li>
          <li>
            <strong>Service availability:</strong> Slow or unavailable AI
            grading can delay play; instructors can grade manually if Jev does
            not respond in time.
          </li>
          <li>
            <strong>Group participation:</strong> One student could dominate a
            group&apos;s answer, so the collaborative format should be
            evaluated in practice.
          </li>
          <li>
            <strong>Class size:</strong> The number of available group colors
            limits the number of groups; larger classes may need larger groups.
          </li>
          <li>
            <strong>Device access:</strong> Students are expected to have a
            phone or laptop, though a group can still participate if some
            members do not have a device.
          </li>
        </ul>
      </ArcadeCard>
    </div>
  );
}
