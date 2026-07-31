# 🎥 Video Recording Script: RentNest Overview

> **Tip before recording:** Make sure you have your local server (`npm run dev`) and your backend running. Prepare three separate browser windows or use Incognito mode so you can be logged in as a Tenant, Landlord, and Admin simultaneously without having to constantly log out and back in.

---

## ⏱️ 0:00 - 1:30 | Introduction & Next.js Architecture

**[Screen: Show the RentNest Homepage]**
"Hello everyone! Welcome to my walkthrough of **RentNest**, a comprehensive rental property marketplace. Our platform seamlessly connects Tenants, Landlords, and Platform Admins into one unified system. 

**[Screen: Switch to your Code Editor (VS Code)]**
"Before we look at the UI, I want to briefly touch on the architecture. This project is built entirely on **Next.js 15 using the App Router**. 
- As you can see in the `src/app` directory, we've organized our routes using Route Groups like `(public)` and `(dashboard)` to cleanly separate our public-facing marketplace from our protected dashboard logic. 
- We use **Next.js Middleware** as our ultimate gatekeeper. It intercepts every request to the `/dashboard` routes and strictly validates the HTTP-only cookies to ensure users can only access their specific role's dashboard."

---

## ⏱️ 1:30 - 3:30 | Demonstrating Roles & The UI

**[Screen: Show the Admin Dashboard (Window 1)]**
"Let's look at how the UI adapts to the three different roles. Right now, I'm logged in as an **Admin**. My dashboard gives me high-level analytics on active properties and platform status. I can also manage the global categories that landlords use."

**[Screen: Show the Landlord Dashboard (Window 2)]**
"Now, if I switch to my **Landlord** account, the UI completely changes. Instead of platform analytics, I see my specific property portfolio, my active properties, and any incoming rental requests from tenants."

**[Screen: Show the Tenant Dashboard (Window 3)]**
"Finally, as a **Tenant**, my dashboard focuses strictly on my personal rental history, payments, and reviews. The middleware ensures that if the Tenant tries to manually type `/dashboard/admin` in the URL, they will be instantly redirected away."

---

## ⏱️ 3:30 - 5:30 | CRUD Operations & Error Handling

**[Screen: Landlord Dashboard -> Properties -> Create Property]**
"Let's demonstrate some CRUD operations and how we handle validation. I'll go to the Landlord dashboard and try to create a new property listing."

**[Screen: Submit the form totally empty]**
"If I click 'Create' without filling anything out, you'll see our **Validation** kick in. We use React Hook Form paired with Zod schemas to ensure strict, inline validation errors before the request ever hits the backend."

**[Screen: Fill out the form and submit]**
"Once I fill it out properly and submit, you'll see a success toast notification in the bottom right, and the new property appears in my list. 

**[Screen: Try to delete an ACTIVE property to show a network error/toast]**
"We also handle backend errors gracefully. For example, if I try to delete a property that currently has an 'ACTIVE' tenant in it, the backend will return a 409 Conflict. Our frontend catches this and displays a friendly error toast explaining exactly why the action was blocked, rather than just crashing."

---

## ⏱️ 5:30 - 7:00 | Payment Integration Flow

**[Screen: Tenant Dashboard -> Find an 'APPROVED' request]**
"Next, I'll walk you through our Stripe Payment integration. As a Tenant, once a Landlord approves my rental request, the status changes to 'APPROVED' and a 'Pay Now' button appears."

**[Screen: Click 'Pay Now' and go through Stripe Checkout (use test card 4242 4242...)]**
"Clicking this initiates a secure checkout session with our backend, which then redirects me to the Stripe hosted checkout. I'll enter the Stripe test card here."

**[Screen: Redirect back to the Success Page]**
"Once the payment clears, Stripe redirects me back to our `/payment/success` page. You'll notice a loading spinner here—this is our frontend actively polling our backend database to verify that the Stripe Webhook has successfully updated the payment status to 'COMPLETED' before we show the green success checkmark."

---

## ⏱️ 7:00 - 8:30 | Technical Challenge Overcome

**[Screen: Back to VS Code showing `src/app/(dashboard)/dashboard/tenant/requests/[id]/pay/page.tsx`]**
"To wrap up, I want to highlight a specific technical challenge I solved during this payment flow. 

When initiating the Stripe checkout, we pass a `successUrl` that includes the specific `rentalId` in the query parameters so our frontend knows which rental to verify upon return. However, we discovered that third-party gateways or backend configurations were stripping our custom query parameters during the redirect! When Stripe sent the user back to our success page, the `rentalId` was completely missing from the URL, causing our verification to crash.

**[Screen: Point to the `localStorage.setItem` code in the file]**
"To solve this robustly without touching the backend, I implemented a pre-flight caching mechanism. The exact moment the user clicks 'Pay', our frontend securely saves the `rentalId` into the browser's `localStorage`. 

**[Screen: Switch to `success/page.tsx` showing the fallback logic]**
"When Stripe redirects the user back, our success page intelligently checks the URL first, and when it sees the parameter is missing, it instantly falls back to reading the ID from `localStorage`. This completely bypassed the parameter-stripping issue and resulted in a bulletproof, 100% reliable post-payment user experience."

"Thank you for watching!"
