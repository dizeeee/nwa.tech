<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';

	const privacy = `
# Privacy Policy - nwa.tech

Updated: August 2, 2025

## 1. Who We Are

nwa.tech is operated by an individual in the United States in a personal capacity.

## 2. What We Collect

- Account and contact info: email, display name, password hash.

- Event/activity data: events you create or attend, messages you send.

- Technical data: IP address, device/browser info, cookies, server logs.

- Optional submissions: images, links, and descriptions you upload.

## 3. How We Use Information

- Provide and secure the Service: account creation, login, fraud prevention, debugging.

- Transactional communications: verification emails, attendance confirmations, security alerts.

- Service improvement: analytics and feature development.

- Legal/safety: comply with law, respond to lawful requests, and protect users.

## 4. What We Don't Do

- We do not sell personal information.

- We do not include advertising in transactional emails.

## 5. Sharing

- Service providers (e.g., hosting, email delivery, analytics) under contractual obligations.

- Legal/safety disclosures as required by law or to prevent harm.

- Public content: event listings or profiles you choose to make public. (e.g. on the website)

## 6. Data Retention

- Keep data only as long as needed for the purposes above, then delete or anonymize.

- You may request deletion of your account; we'll retain limited records as required for security, legal, or transactional logs.

## 7. Your Choices and Rights

- Access, update, or delete your account information by contacting nwatech@jackmal.com.

- Opt out of marketing emails (if any) via unsubscribe links; transactional emails are necessary for the Service.

- State privacy rights: If you're a resident of CA, CO, CT, VA, UT, etc., you may have additional rights; contact us to exercise them.

## 8. Children

The Service is for users 13+ only. We do not knowingly collect personal information from children under 13.

## 9. Security

We use reasonable technical and organizational measures (e.g., HTTPS, password hashing, access controls). No method is 100% secure.

## 10. International Users

The Service is U.S.-based and primarily intended for U.S. users. If you use it from outside the U.S., your data may be processed in the U.S.

## 11. Third-Party Services and Links

The Service may integrate with or link to third-party websites and services. The Operator does not control or endorse third parties and is not responsible for their content, security, policies, or practices. Your use of third-party services is governed by their terms and policies.

## 12. Service Providers

The Operator may use third-party service providers (e.g., hosting, email delivery, analytics, content delivery networks) to operate and improve the Service.

## 13. No Responsibility for Third-Party Events

For events hosted by third parties, all interactions are solely between you and the third party. The Operator is not responsible for event safety, accuracy, cancellations, or conduct.

## 14. Changes

We may update this Policy. Changes take effect upon posting with a new Effective Date.

## 15. Contact

- nwatech@jackmal.com
`;
</script>

<div class="mt-8 mb-24">
	<Markdown content={privacy} />
</div>
