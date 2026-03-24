# RAG-dhmc-precedent-checker

## Inspiration
PolicyProof AI came from noticing how often patients feel something is wrong with an insurance denial but don’t know how to prove it. Medical and policy language is complex on purpose, and that complexity can stop people from advocating for themselves—especially when they’re already dealing with serious health issues. This project was inspired by the idea that giving people clear, verifiable information can help restore confidence and control.

## What it does
PolicyProof AI helps users understand and challenge insurance denials. A user uploads a denial letter, and the system analyzes it step by step, identifying the denial reason and verifying it against current policy and clinical standards. The results are shown in a clear, side-by-side view comparing what the insurer claimed with what the policy actually allows. The platform also generates a professionally formatted appeal letter backed by real citations.

## How we built it
The frontend was built using TypeScript, JavaScript, HTML5, and CSS3 to create a clean, high-trust interface. The backend was built in Python 3, exposing API endpoints that process uploaded documents and return structured results in JSON.

A simulated Retrieval-Augmented Generation (RAG) workflow is used to match denial language against a curated policy knowledge base. Vector-style matching logic helps identify relevant statutes and guidelines, and MongoDB is used to model case data and support future analytics. Each step of the process is surfaced through an audit-style flow to keep the system transparent.

## Challenges we ran into
Working with medical and policy language required careful handling to avoid oversimplifying important details. Another challenge was building trust—both in how results are presented and in avoiding a “black box” AI experience. Balancing clarity, accuracy, and usability was a constant design and technical consideration.

## Accomplishments that we're proud of
We’re proud of creating a system that turns a confusing insurance denial into something understandable and actionable. The split-screen comparison makes policy mismatches obvious, and the generated appeal letters are grounded in real policy logic rather than generic templates. The platform emphasizes transparency at every step.

## What we learned
We learned that people trust systems more when they can see how decisions are made. We also learned that thoughtful design and clear structure can make even complex legal and medical information approachable without losing accuracy.

## What's next for PolicyProof AI
Next, we plan to expand the policy knowledge base beyond a single state, strengthen the vector matching system, and introduce aggregated insights to highlight broader denial patterns. The long-term goal is to make PolicyProof AI a reliable advocacy tool for patients, advocates, and policy researchers.
