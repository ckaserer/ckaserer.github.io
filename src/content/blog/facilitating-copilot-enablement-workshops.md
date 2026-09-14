---
title: "Facilitating Copilot Workshops: What Doesn't Get a Raised Hand"
description: "Five things that fail the same quiet way unless they're checked before the session starts: a mismatched audience, jargon I stopped noticing, group size, license prerequisites, and the venue's own network."
pubDate: 2026-09-13
updatedDate: 2026-09-14
tags: ["workshops", "github-copilot", "facilitation", "enablement"]
---

I've run a number of GitHub Copilot enablement workshops now, for groups ranging from a handful of engineers to entire departments, and the sessions that went wrong almost never went wrong on content. They went wrong on decisions I'd made about the room and the audience before I opened a single slide.

## What I tried first — and why it broke

None of this was obvious going in. It's what I actually did before I knew better, and the specific way each choice failed.

**One session for everyone who signed up.** Put someone who just got their Copilot license in the same room as someone who wants to talk about cache expiry, and something predictable happens: the advanced person asks freely, because a detailed question doesn't make them look behind. The beginner does the opposite — asking the "obvious" question in front of people clearly ahead of them feels exposing, so they don't. The session ends up shaped entirely by the advanced questions, and the beginners quietly disengage without anyone noticing until it's over.

**One facilitator, as many people as signed up.** A large remote session works fine as a broadcast — cameras off, chat quiet, everyone half-listening through their day. It stops working the moment the goal is hands-on: even 15 people with laptops open is already too many for one person to help when they get stuck in different places at different times.

**The invite said "you'll need a license," so I assumed people had one.** They didn't, not always. Participants have shown up without provisioning despite it being a stated prerequisite, which meant restructuring the workshop live, in front of the room, to give them something to do while everyone else went hands-on.

**"There's Wi-Fi" felt like enough.** It isn't. Running a hands-on session on a company's own network means going through their proxy, and a corporate proxy can quietly block exactly the traffic a Copilot exercise depends on — something you don't discover by asking whether there's internet, only by someone actually trying to use the tool.

**"I know this material, so the deck is fine."** Building a workshop from scratch in a field I already work in means the curse of knowledge sets in everywhere — a term I stopped noticing is a term, a step I stopped counting as a step. A colleague reviewing the same deck won't catch it either, because they carry the same background I do. It doesn't surface as a bad slide; it surfaces as a room that's a little more lost than it should be, for reasons nobody names.

## Why none of this announces itself live

A wrong word or an awkward phrase is recoverable — I notice, or someone asks, and I rephrase on the spot. None of the five things above work that way. By the time I'm standing in the room, the audience is already mixed or split, the facilitator ratio is already fixed, the licenses are provisioned or they aren't, and the network either carries Copilot's traffic or it doesn't. And if the material assumes background someone doesn't have, they don't raise a hand to say so — they just go quiet, the same way a beginner does in a badly mixed audience. None of it comes with a signal, so it has to be caught before the room, or it doesn't get caught at all.

That's the part that's easy to underrate when you're heads-down on the deck the night before: the room isn't the setting for the workshop, it's a set of decisions with the same deadline as the content — including the parts of the content that only look like content.

## The check for the blind spot inside the material

A colleague of mine calls this one **singing-and-clapping validation**: could you get the idea across to a room of kindergartners — no shared vocabulary, nothing but singing and clapping — and still have them follow the shape of it? Not because participants are children. It's because I don't know what baseline they're actually starting from, and I can't see my own blind spots in a field I've been working in for years; a colleague reviewing my deck can't either, since they share the same background. Someone with zero prior exposure can.

I run new material through that test before it reaches a participant: if I can't get the core idea across without leaning on a term or a prior step I never actually stated, the slide isn't ready yet, no matter how accurate it is.

## The one that actually happened

The clearest case was the license gap. A participant arrived, laptop open, ready to go — no license. Not a hypothetical: I had to improvise on the spot, splitting my attention between getting them unblocked and keeping the rest of the group moving through the hands-on exercise. A five-minute confirmation email sent two days earlier would have caught it before anyone was in the room. Nothing about the workshop's content would have told me that; only checking the thing itself would have.

## What I do differently now

**Do:** ask a one-line self-assessed skill question at sign-up and split tracks if the range is wide; run new material through a "would a total beginner follow this" pass before anyone else sees it; size hands-on groups to roughly 4–5 participants per facilitator; confirm licenses a few days out instead of trusting the invite; test the actual network path before the day and book a dedicated room with real breaks.
**Don't:** treat a stated prerequisite as confirmed, assume a format that works for a broadcast also works for hands-on, or trust your own read of "is this clear" on material you built yourself.
**Check:** everything above, before the day — none of it comes with a raised hand once people are already in the room.

A raised hand tells me live when something's wrong. These five things never come with one — which is exactly why they get checked before the room does the deciding for me.
