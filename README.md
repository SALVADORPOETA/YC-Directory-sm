# YC Directory

Tech Stack: Next.js, TypeScript, TailwindCSS, Sanity, Zod, GitHub OAuth

This project is a real-time startup listing platform built with TypeScript and styled using TailwindCSS. It was developed following a tutorial by the YouTube channel JavaScript Mastery.

The homepage displays a dynamic list of startups fetched from Sanity. When a user submits a new startup from anywhere in the world, it appears instantly on the homepage for all users—no page reload required. A real-time search bar allows filtering startups by title, creator name, or category.

Clicking on a startup navigates to a detailed pitch page containing the title, publication date, description, thumbnail, author information, and markdown-supported pitch content. At the bottom, related posts are displayed. One standout feature is the live view counter powered by Next.js’s Partial Prerendering (PPR): the main content is statically cached using Incremental Static Regeneration (ISR) for 60 seconds, while the view count is rendered on the server at each request, ensuring accuracy without sacrificing performance.

The same PPR strategy is applied to the user profile page—user information is cached, but dynamic content like submitted startups is regenerated on every request to reflect real-time data.

To submit a startup, users must authenticate via GitHub using social login. Account data is stored in Sanity. The submission form is built with Next.js Server Actions and useFormState, with all fields validated through Zod.

<img width="765" height="605" alt="ycdirectory" src="https://github.com/user-attachments/assets/21715e38-bac2-4d20-ae01-0f44b6647597" />
