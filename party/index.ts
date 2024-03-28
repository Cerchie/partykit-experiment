import type * as Party from "partykit/server";

import { producer } from "../kafka";

import type { Poll } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  poll: Poll | undefined;

  async savePoll() {
    if (this.poll) {
      await this.room.storage.put<Poll>("poll", this.poll);
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const poll = (await req.json()) as Poll;
      this.poll = { ...poll, votes: poll.options.map(() => 0) };
      // ADD THIS LINE:
      this.savePoll();
    }

    if (this.poll) {
      return new Response(JSON.stringify(this.poll), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async onMessage(message: string) {
    await producer.connect();
    if (!this.poll) return;
    const event = JSON.parse(message);
    await producer.send({
      topic: "test",
      messages: [{ value: JSON.stringify({ event }) }],
  });
    if (event.type === "vote") {
      this.poll.votes![event.option] += 1;
      this.room.broadcast(JSON.stringify(this.poll));
      this.savePoll();
    }
  }

  async onStart() {
    this.poll = await this.room.storage.get<Poll>("poll");
  }
}

Server satisfies Party.Worker;