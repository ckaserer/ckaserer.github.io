---
title: "Lessons Learned Facilitating GitHub Copilot Enablement Workshops"
description: "Five things I've learned the hard way from running GitHub Copilot enablement workshops: segmenting by skill level, right-sizing groups, verifying prerequisites, and planning the room."
pubDate: 2026-09-13
tags: ["workshops", "github-copilot", "facilitation", "enablement"]
---

I've run a number of GitHub Copilot enablement workshops over the past while, for groups ranging from a handful of engineers to entire departments. This is the first in a series of posts on what I've learned facilitating technical workshops — starting with the lessons that showed up again and again in the Copilot sessions specifically.

None of these are exotic. They're the kind of thing that's obvious in hindsight and easy to skip when you're focused on the content instead of the room.

## 1. Know your audience — segment by skill level

The knowledge gap in a typical Copilot rollout is huge: some people just got their license yesterday, others already want to talk about cache expiry and where a specific setting lives in the UI. Put both groups in the same session and something predictable happens — the advanced people ask questions freely, because asking a detailed question doesn't make them look like they don't know something. Beginners tend to do the opposite: asking a basic question in front of people who are clearly ahead of them feels exposing, so they simply don't. The session ends up shaped entirely by the advanced questions, and the beginners quietly disengage without anyone noticing.

A dedicated beginner track — with no advanced participants in the room — fixes this. It gives people room to learn at their own pace, ask the "obvious" question out loud, and actually feel heard, instead of getting pulled into advanced territory they haven't grasped the basics for yet.

**Do:** split into a beginner track and an advanced track when the group's technical range is wide; ask a one-line self-assessed skill-level question at sign-up so you know where the split should fall.
**Don't:** assume one session can serve "I just got a license" and "when does the cache expire" at the same time.
**Check:** before the session, confirm the skill-level spread of the registered group — if it's wide, split it before you're standing in the room.

## 2. Right-size the group

Format has to match size, or you get the worst of both.

A 100-person remote session is a radio show, not a workshop. Cameras off, chat quiet, everyone half-listening while they get through their actual day — you reach a lot of people and change very little. That's fine if the goal really is a broadcast, but it's worth naming it as one rather than calling it a workshop.

On the other end, even 15 people is already tricky if everyone has a laptop open and is expected to work through something hands-on — one facilitator can't meaningfully help that many people who are stuck in different places at different times. The ratio that's actually worked well for hands-on, use-case-driven sessions: roughly **4–5 participants per facilitator**. That size is small enough to avoid constant cross-talk and long alignment discussions, but still lets people bounce ideas off each other before going heads-down.

**Do:** match the format to the size — lecture/broadcast for large groups, small hands-on cohorts (~4–5 per facilitator) for anything where people need to actually do something.
**Don't:** run a 100-person session and expect participation, or a 15-person hands-on session with a single facilitator and expect everyone gets help.
**Check:** count participants against available facilitators *before* committing to a hands-on format — recruit co-facilitators if the ratio doesn't work, or shrink the group.

## 3. Verify prerequisites — don't just list them

Putting "you'll need a Copilot license" in the invite is not the same as everyone having one. We've had participants show up without a license despite it being a stated pre-requirement, which meant restructuring the workshop live, on the spot, to accommodate people who couldn't do the hands-on part yet.

A prerequisite that's only ever been *stated* is a hope, not a fact. It needs an actual confirmation step before the day.

**Do:** confirm access is provisioned a few days ahead — a short check-in with participants or whoever manages licensing on their side, not just a line in the invite.
**Don't:** treat "it's listed as a prerequisite" as equivalent to "it's done."
**Check:** a pre-workshop checklist, sent early enough that a missing license can still be fixed before the session starts.

## 4. Plan the environment — network and physical space

Two environmental things bit us that are easy to forget when you're focused on content:

**Network.** Running a hands-on session at a company's own office means going through *their* network — and corporate proxy configurations can quietly break exactly the kind of tooling a hands-on Copilot exercise depends on. This isn't something you find out by asking "do you have internet"; it only shows up when someone tries to actually use the tool.

**Physical space.** Hands-on exercises need room of their own — ideally a dedicated space, not the same room as the presentation, so people can talk through a problem without talking over someone else's presentation. And for longer in-person sessions: plan actual breaks. Enough people in one room for long enough and air quality alone becomes the reason attention drops, never mind the content.

**Do:** test the actual network/proxy path participants will use, ahead of the day if at all possible; book a dedicated room for hands-on work; schedule real breaks for longer sessions.
**Don't:** assume "there's Wi-Fi" is the same as "the tool will work," or cram a full day of hands-on work into one shared room with no breaks.
**Check:** a live test of the hands-on tooling against the venue's actual network before the session; a room booking that accounts for hands-on space separately from presentation space.

---

More of these will follow as I keep running workshops on other topics — the room and the audience matter as much as the content, every time.
