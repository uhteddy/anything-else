import Link from "next/link";
import GroupChip from "@/lib/components/game/GroupChip";
import { MOCK_GROUPS, MOCK_GROUP_SIZE } from "@/lib/game/mockGame";

type Params = Promise<{ gameId: string }>;

export const instant = false;

export default async function HostGroups({ params }: { params: Params }) {
  const { gameId } = await params;
  const studentCount = MOCK_GROUPS.reduce((sum, group) => sum + group.members.length, 0);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-12">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Grouping</p>
        <h1 className="text-4xl font-bold">Find your group</h1>
        <p className="text-base-content/70">
          {studentCount} students in {MOCK_GROUPS.length} groups of {MOCK_GROUP_SIZE}. Students
          see their group color on their screen.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_GROUPS.map((group) => (
          <div
            key={group.color.name}
            className="card border-t-8 border-base-300 bg-base-100 shadow-sm"
            style={{ borderTopColor: group.color.hex }}
          >
            <div className="card-body gap-3 p-4">
              <h2 className="card-title">
                <GroupChip color={group.color} size="lg" />
              </h2>
              <p className="text-sm text-base-content/60">2 of {group.members.length} found their group</p>
              <ul className="flex flex-col gap-2">
                {group.members.map((member) => (
                  <li key={member} className="flex items-center justify-between gap-2">
                    <span className="truncate">{member}</span>
                    <select
                      className="select select-xs w-24"
                      aria-label={`Move ${member} to another group`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Move…
                      </option>
                      {MOCK_GROUPS.filter((other) => other !== group).map((other) => (
                        <option key={other.color.name} value={other.color.name}>
                          {other.color.name}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <Link href={`/host/game/${gameId}`} className="btn btn-ghost">
          ← Back to lobby
        </Link>
        <Link href={`/host/game/${gameId}/question`} className="btn btn-primary">
          Start game →
        </Link>
      </div>
    </main>
  );
}
