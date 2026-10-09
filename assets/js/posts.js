/* Blog content and docs pages. Static data = no backend. All text is fictional demo copy. */
window.POSTS = [
  { slug: "planning-without-meetings", title: "How we cut status meetings by 70%", tag: "Product", cover: "blog-1.svg", date: "Oct 2, 2026", mins: 5,
    excerpt: "Most status meetings exist because the plan is out of date. Here's how living plans changed the way our team works.",
    body: [["p", "Every team has the same Monday ritual: a room full of people reading out what they did last week. It feels productive, but it mostly exists because nobody trusts the plan."],
      ["h2", "Make the plan the source of truth"], ["p", "When boards update themselves from the work, status becomes a thing you look up instead of a thing you ask for. We stopped scheduling the weekly sync and replaced it with a two-minute read of the board."],
      ["h2", "Keep one place for decisions"], ["p", "Decisions made in chat vanish. Decisions pinned to the task they affect stay useful for months. We write the decision, the reason, and who to ask, right on the card."],
      ["h2", "What changed"], ["p", "Meeting hours dropped by 70%, handoffs got clearer, and new teammates onboard from the board history instead of a wiki nobody updates."]] },
  { slug: "estimating-honestly", title: "Estimating honestly: a field guide", tag: "Guides", cover: "blog-2.svg", date: "Sep 18, 2026", mins: 7,
    excerpt: "Why estimates slip, and a simple range-based method that makes deadlines believable again.",
    body: [["p", "Single-number estimates are a polite fiction. The truth is a range, and the width of the range tells you how much you don't know."],
      ["h2", "Ask for a range, not a number"], ["p", "Ask for a best case and a worst case. If they're far apart, you've found risk early, when it's cheap to deal with."],
      ["h2", "Track what actually happened"], ["p", "Compare estimates to outcomes every sprint. Within a month your team will know its own bias better than any framework could tell it."],
      ["h2", "Share the range"], ["p", "Stakeholders handle uncertainty well when you show it plainly. They handle surprises badly."]] },
  { slug: "async-first-teams", title: "Running an async-first team across 9 time zones", tag: "Culture", cover: "blog-3.svg", date: "Aug 29, 2026", mins: 6,
    excerpt: "What worked, what didn't, and the three rituals we'd keep if we had to start over.",
    body: [["p", "Async doesn't mean slow. It means the work doesn't wait for everyone to be awake at the same time."],
      ["h2", "Write things down"], ["p", "A good update answers three questions: what changed, what's blocked, what do you need. Anyone can read it in a minute, in any time zone."],
      ["h2", "Protect overlap hours"], ["p", "We keep two shared hours for the things that really need a conversation, and protect the rest of the day for deep work."],
      ["h2", "Celebrate in public"], ["p", "Remote teams lose the hallway high-five. Pin wins to the board, and you get it back."]] }
];
window.DOCS = [
  { slug: "intro", title: "Introduction", body: [["p", "Nimbus is a planning tool for teams that want one source of truth. Boards, timelines and reports all read from the same tasks, so they never disagree."], ["h2", "Core ideas"], ["p", "Everything is a task. Tasks live on boards. Timelines and reports are views of the same data."]] },
  { slug: "quickstart", title: "Quickstart", body: [["p", "Create a workspace, invite your team, and add your first board in under two minutes."], ["h2", "1. Create a workspace"], ["p", "Pick a name and a URL. You can change both later."], ["h2", "2. Add a board"], ["code", "nimbus boards create \"Sprint 24\" --template kanban"], ["h2", "3. Invite your team"], ["p", "Paste emails or share a link. Teammates join with one click."]] },
  { slug: "boards", title: "Boards & tasks", body: [["p", "Boards are made of columns, columns hold tasks. Drag a task between columns to change its status."], ["h2", "Custom fields"], ["p", "Add priority, estimate, or any field your team needs. Fields can be used in filters and reports."]] },
  { slug: "integrations", title: "Integrations", body: [["p", "Connect Nimbus to the tools your team already uses: chat, calendars, source control and support desks."], ["h2", "Webhooks"], ["code", "POST /v1/webhooks\n{ \"url\": \"https://example.com/hook\", \"events\": [\"task.done\"] }"]] },
  { slug: "api", title: "API reference", body: [["p", "The REST API uses JSON and API keys. All endpoints are versioned under /v1. (Demo documentation: there is no real API.)"], ["h2", "List tasks"], ["code", "GET /v1/tasks?board=sprint-24\nAuthorization: Bearer <token>"]] }
];
