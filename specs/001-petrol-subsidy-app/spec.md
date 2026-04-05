# Feature Specification: Petrol Subsidy Demo App (AI-Powered)

**Feature Branch**: `001-petrol-subsidy-app`
**Created**: 2026-04-05
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Check Eligibility via CNIC (Priority: P1)

A user (motorcycle owner, rickshaw driver, or low-income individual) visits the app,
sees a simple landing page explaining the subsidy, taps "Check Eligibility", enters
their 13-digit CNIC, and receives an instant simulated result (Eligible / Not Eligible)
with a plain-language explanation in English + Roman Urdu.

**Why this priority**: This is the primary user goal and the entry point of the entire
application. Without it, no other feature is meaningful. It can be built and demoed
independently as a complete MVP.

**Independent Test**: A tester enters a valid CNIC (format: XXXXX-XXXXXXX-X) and receives
a clear eligibility result with explanation. No other feature needs to be present.

**Acceptance Scenarios**:

1. **Given** a user on the Landing Page, **When** they tap "Check Eligibility", **Then**
   they are taken to the CNIC input screen.
2. **Given** the CNIC input screen, **When** the user enters a correctly formatted CNIC
   (XXXXX-XXXXXXX-X) and submits, **Then** they receive an Eligible or Not Eligible
   result with a plain-language explanation in English and Roman Urdu.
3. **Given** the CNIC input screen, **When** the user enters a CNIC with an incorrect
   format, **Then** an inline validation error appears before the form is submitted.
4. **Given** any eligibility result screen, **Then** a visible disclaimer reading
   "This is NOT a real government app — data is simulated" MUST be present.

---

### User Story 2 - AI Eligibility Prediction (Priority: P2)

A user who wants a more detailed eligibility check enters their monthly salary, vehicle
type (motorcycle / rickshaw / car), and estimated monthly fuel usage in litres. The AI
returns an eligibility verdict with a simple explanation in English + Roman Urdu.

**Why this priority**: Adds AI-powered depth to the basic CNIC check and is the key
portfolio/YouTube differentiator. Independently demonstrable without Dashboard.

**Independent Test**: A tester fills the three-field prediction form and receives an
AI-generated eligibility result with a Roman Urdu explanation. US1 should work but is
not required for this story's isolated test.

**Acceptance Scenarios**:

1. **Given** the AI Prediction form, **When** a user enters salary ≤ PKR 50,000,
   vehicle = motorcycle, usage ≤ 30 L/month, and submits, **Then** the AI returns
   "Eligible" with a simple Roman Urdu explanation.
2. **Given** the AI Prediction form, **When** a user enters salary > PKR 150,000
   and vehicle = car, **Then** the AI returns "Not Eligible" with an explanation.
3. **Given** any AI result, **Then** the response MUST use simple language (no
   technical jargon) and include a disclaimer.
4. **Given** the AI service is unavailable, **When** the user submits, **Then** a
   friendly error message is displayed in place of raw error text.
5. **Given** the form is submitted with empty required fields, **Then** inline
   validation errors appear on each empty field before submission.

---

### User Story 3 - Personal Dashboard with History and Charts (Priority: P3)

An eligible user sees their personalised dashboard showing monthly quota (20L default),
remaining litres, a usage summary, a transaction history list, and a usage-trend chart.

**Why this priority**: Core engagement feature making the demo feel like a real government
portal. Builds on US1 (CNIC establishes identity) but is independently demonstrable with
mock data.

**Independent Test**: After CNIC check (US1) returns Eligible, navigating to Dashboard
shows quota, remaining fuel, transaction list, and usage chart — all using seeded mock data.

**Acceptance Scenarios**:

1. **Given** an eligible mock user, **When** they open the Dashboard, **Then** they
   see: monthly quota (20L), remaining litres, and a visual usage summary.
2. **Given** the Transactions section, **When** the user scrolls, **Then** each entry
   shows: date, litres used, and remaining quota after that event.
3. **Given** the Charts section, **When** rendered, **Then** a line or bar chart of
   usage over the past month is displayed using mock transaction data.
4. **Given** any dashboard page, **Then** the disclaimer is visible in the footer.

---

### User Story 4 - QR Voucher System (Priority: P4)

The user generates a QR code voucher representing their current remaining quota. A
simulated "scan" flow deducts a specified number of litres from the quota and logs
a new transaction entry.

**Why this priority**: High-impact viral demo moment showing a complete subsidy
redemption flow. Requires Dashboard (US3) to display updated quota.

**Independent Test**: Dashboard is present (US3). User taps "Generate QR Voucher",
a QR code appears, user taps "Simulate Scan", enters litres to deduct, and the quota
decrements with a new transaction in the list.

**Acceptance Scenarios**:

1. **Given** the Dashboard, **When** the user taps "Generate QR Voucher", **Then**
   a QR code is displayed containing the user's CNIC and remaining quota (mock).
2. **Given** the QR voucher screen, **When** the user taps "Simulate Scan" and
   enters a litre value ≤ remaining quota, **Then** the quota is decremented and
   a new transaction entry is added.
3. **Given** the user tries to deduct more litres than remaining quota, **When** they
   submit, **Then** an error message "Quota nahin hai — insufficient quota" is shown.
4. **Given** quota reaches 0L, **Then** the "Generate QR Voucher" button is disabled
   with the message "Aapka monthly quota khatam ho gaya".

---

### User Story 5 - AI Chatbot + Voice Assistant (Priority: P5)

The user opens a chatbot that answers common questions about the subsidy in simple
English + Roman Urdu. A speaker icon on each bot response allows the user to hear
the text read aloud via text-to-speech.

**Why this priority**: AI polish and demo "wow factor". Does not block any other story
and can be added last without disrupting the core flow.

**Independent Test**: Chatbot panel opens, user types "Am I eligible?", receives a
helpful English + Roman Urdu response within 5 seconds. Speaker icon plays the response
as audio.

**Acceptance Scenarios**:

1. **Given** the chatbot is open, **When** a user types "eligibility kya hai?", **Then**
   the bot responds in simple English + Roman Urdu within 5 seconds.
2. **Given** a chatbot response, **When** the user taps the speaker icon, **Then** the
   response text is read aloud via TTS.
3. **Given** the AI service is unavailable, **When** the user sends a message, **Then**
   a fallback response "Sorry, service abhi available nahin — try again later" is shown.
4. **Given** any chatbot response, **Then** it MUST include a disclaimer that this is a
   simulated app, not an official government service.

---

### Edge Cases

- What if a CNIC passes format validation but is mapped to "not eligible" in the mock
  logic? → Show "Not Eligible" result clearly; no error state.
- What if AI prediction inputs are at a boundary value (e.g., salary exactly PKR 50,000)?
  → The mock rule is: salary ≤ 50,000 = Eligible; ≥ 50,001 = requires other factors.
- What if remaining quota is 0 and the user tries to generate a QR code? → Disable the
  button and show an informative message.
- What if TTS is not supported by the user's browser? → Hide the speaker icon gracefully
  with no error thrown.
- What if the user submits the AI Prediction form with empty or invalid fields? → Show
  inline validation errors; do not call the AI API.
- What if a mock user has no transaction history yet? → Show an empty state illustration
  with the message "Abhi tak koi transaction nahin hua".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a visible disclaimer on every page: "This is NOT a
  real government app — data is simulated for demo purposes."
- **FR-002**: The Landing Page MUST include a hero section explaining the subsidy concept
  in simple language and a prominent "Check Eligibility" CTA button.
- **FR-003**: The CNIC input MUST validate the format XXXXX-XXXXXXX-X (13 digits with
  hyphens at positions 6 and 14) and reject invalid formats with an inline error.
- **FR-004**: The CNIC eligibility check MUST use a deterministic rule-based mock function
  (not a real government database) and return Eligible or Not Eligible with a reason.
- **FR-005**: The AI Prediction feature MUST accept three inputs: salary (positive integer
  in PKR), vehicle type (motorcycle / rickshaw / car), and monthly usage (litres, positive
  number).
- **FR-006**: The AI Prediction MUST call the LLM API server-side with a system prompt
  that enforces simple language, Roman Urdu mixing, and a disclaimer in every response.
- **FR-007**: The Dashboard MUST display monthly quota (default 20L), remaining litres,
  and a usage summary for the mock user identified by their CNIC session.
- **FR-008**: The Transactions section MUST list all usage events with date, litres used,
  and remaining quota after each event, ordered by date descending.
- **FR-009**: The Charts section MUST render a usage-trend visualisation with mock
  transaction data showing at minimum the past 30 days.
- **FR-010**: The QR Voucher system MUST generate a scannable QR code and a "Simulate
  Scan" flow MUST deduct a user-specified litre amount from the quota, logging a
  transaction entry.
- **FR-011**: The Chatbot MUST handle at minimum: eligibility rules, quota amount, quota
  reset cycle, how to use the QR voucher, and what the disclaimer means.
- **FR-012**: The Chatbot MUST include a TTS button on each bot response that reads
  the response text aloud; if TTS is unsupported, the button MUST be hidden silently.
- **FR-013**: All LLM API calls MUST be made server-side — never directly from the
  browser client.
- **FR-014**: All API keys and database credentials MUST be stored in environment
  variables and MUST NOT be committed. A `.env.example` with placeholder values MUST
  exist in the repository root.
- **FR-015**: The entire UI MUST be designed mobile-first at a 320px baseline with tap
  targets meeting minimum accessible size requirements.
- **FR-016**: A "Reset Quota" button on the Dashboard MUST simulate a new monthly cycle
  by restoring the quota to the default value and clearing transactions (demo only).

### Key Entities

- **User (Mock)**: Represents a subsidy applicant. Attributes: CNIC (unique identifier),
  name, phone, vehicle type, eligibility status. Persisted in the database.
- **Quota**: One record per user. Tracks total monthly quota (default 20L) and remaining
  litres. Tied to the user record.
- **Transaction**: One record per fuel-use event. Tracks: user reference, date/time,
  litres used, remaining quota after the event. Ordered descending by date.
- **ChatMessage**: Ephemeral (session-only, not persisted). Holds one turn of the
  chatbot conversation: user message text and AI response text.

### Assumptions

- Authentication is simulated via CNIC session (no real auth, no passwords).
- Quota reset is manual (a "Reset Quota" button) — no automated cron for demo purposes.
- All transaction data is seeded on first load with realistic mock entries.
- TTS uses the browser-native Web Speech API as primary; no third-party TTS billing.
- The LLM system prompt is hardcoded in the server action, not user-configurable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can navigate from the Landing Page to an eligibility
  result in under 60 seconds without reading any instructions.
- **SC-002**: The AI eligibility prediction result is displayed within 5 seconds of
  form submission under normal network conditions.
- **SC-003**: The chatbot response is displayed within 5 seconds of the user sending
  a message.
- **SC-004**: The Dashboard renders with mock data within 2 seconds of navigation.
- **SC-005**: The disclaimer is visible on 100% of app pages without scrolling on a
  375px-wide mobile viewport.
- **SC-006**: A user can complete the full demo flow (Landing → CNIC check → Dashboard
  → QR scan → transaction logged) with zero unhandled errors.
- **SC-007**: The Landing Page and Dashboard achieve a Lighthouse mobile performance
  score of at least 85.
- **SC-008**: Every AI response (prediction and chatbot) contains at least one Roman
  Urdu phrase and no technical jargon.
