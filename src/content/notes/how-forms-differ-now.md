---
title: How forms differ from a while ago
excerpt: Catalogue forms, guided flows, and everything between them — and when each one wins.
date: Wed 7 October 2026
readingTime: 6 min read
published: true
---

## What is the purpose of a form?

A form records information. Contact details, leads, support queries, CRM records. The list is long, and each of those is a design problem.

## How are forms typically designed?

HTML provides the form element, thus encouraging the linear form, with all your input fields in one block on your site, or indeed in your app, which works yes. A user can see everything that is expected from them, what is optional, all at a glance.

The trouble with that glance is that nobody reads it. A wall of twenty inputs is a wall of twenty decisions, and people make fewer decisions the more of them they are asked to make.

So, forms split, broadly, into two families. The catalogue family, where everything is on show, and the guided family, where one thing is asked for at a time. Everything else is a mix of the two, or a variation on one of them.

## The catalogue

### Everything on one page

The classic. Name, email, message, submit. Often a form in the footer of every page.

This is the right shape when the number of fields is small and the fields are related. If a user needs to hold four things in their head at once to fill it in, the form is too big.

Strengths:

- Nothing is hidden, so nothing is a surprise later
- The user can check what they have already typed before moving on
- Back and forth between fields costs nothing
- Search engines and password managers treat it well

Weaknesses:

- Length frightens people off
- Errors that belong to different fields get reported together, which reads as "you did this wrong" rather than "fix this one"
- On mobile, a single long column of inputs is a lot of scrolling

### The category page

Longer journeys get broken into pages, each page doing one job. A checkout is the obvious case. Page one collects contact and shipping, page two is the shipping method and options, page three is payment. The next page is not a surprise, because the previous page told you what was coming.

This is a pattern worth copying wherever a process has clear stages. Each page is short, so each page feels quick. Errors belong to one page, so an error message can be specific. Progress is visible, because the user can see they are on step two of three.

The rule of thumb: a step boundary belongs where the user would naturally pause anyway. Not every field deserves a page. Ten pages of one field each is not a guided form, it is a survey with extra steps.

### Progressive disclosure

A single page that grows. Optional sections stay closed until the user opens them. Used for "billing address same as delivery", for account settings, for anything with a long tail of rare fields.

The benefit is that the rare fields stop costing the common case. The risk is that hidden fields get missed, and the user only finds the missing thing at the end.

### Accordion and tabbed sections

Same idea, worse behaviour. Sections of a long form tucked under headings. It saves vertical space and makes the form look calmer than it is. On mobile it is worse still, because scrolling inside a collapsed section is fiddly.

Fine for reference material. Rarely worth it for input.

## The guided flow

### One thing per page

The other extreme. One question, one page, one button. The onboarding pattern, the pattern used when a form has to feel like a conversation.

Each screen is trivial, so completion rates go up, especially on mobile. Nothing to scroll past. Nothing to misunderstand. The cost is momentum: every screen is a chance to stop, and the network is a chance to fail.

Rules that make it work:

- Progress must be visible, a step count or a bar
- Back must be as easy as forward
- The button must say what happens next, not "Continue"
- Answers must be saved, so a dropped connection does not mean starting again

### The conversation

Tighter than one per page. A chat window, an input at the bottom, the form disguised as a transcript. It suits short things, a quick qualification, a support triage. It does not suit long answers, because long answers deserve a real box.

The transcript is a history, so it also gives the user a record of what they said without any extra work.

### The assistant that fills it in

Modern forms increasingly arrive half filled. The browser knows the email. The address API knows the postcode. The payment provider knows the card. The form asks for what is left, which is often a name and a confirmation.

This is the biggest practical change from a while ago, and it is mostly invisible. The design question is no longer "what fields do we need" but "what can we get without asking".

### Chat and voice as an input

A step further: the user answers in their own words and something on the other side reads it back as a draft. Good for long descriptions, for complaints, for anything where typing a paragraph is a chore. The catch is verification, since a parsed answer can be wrong, so it needs checking before it is trusted.

## Things that sit between the two

- **Inline validation and add-as-you-go.** Save each field as it is filled. Turns a form into a series of tiny forms. Feels fast, adds requests.
- **The magic link.** Ask for one field, send a link, let the link open a form that is already filled in from the account. No password, no second page.
- **Save and return later.** Store a partial form against the session, email a resume link. Necessary for long applications, and the pattern most insurance and tax sites got wrong for years.
- **Upload as a form.** Drop a file, let the parsing fill the fields. Turns a form into a photograph of a document.
- **Bulk entry.** A table where every row is a record and the cell is the field. Rarely thought of as a form at all, but it is the right shape when the data is repetitive.
- **Search instead of select.** A combobox over a huge list of options. Better than a dropdown of four thousand countries, and harder to build well.
- **Signatures and confirmations.** A checkbox that says you agree, usually doing two jobs: consent and proof. Legal weight without design weight.

## Choosing between them

Some rough guidance:

- Few fields, related, low stakes: one page
- Clear stages, more than a handful of steps: one stage per page
- Long, unfamiliar, on mobile: one question per page
- Editing settings rather than creating something: progressive disclosure
- Anything a machine will read back to a human: keep the transcript

The mistake is treating this as a style choice. The layout decides how much the user has to hold in their head at once.

Before building, ask what is already known. A field that can be filled without asking should not be visible.