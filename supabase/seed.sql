-- ============================================================
-- Cyber Cookie — sample seed data (3 issues)
-- ============================================================

INSERT INTO issues (issue_number, issue_date, title, summary, sign_off) VALUES
(1, '2024-01-15',
 'Midnight Blizzard Strikes Again, Critical Ivanti Zero-Day, and AI-Powered Phishing',
 'This week: a nation-state actor breaches Microsoft email infrastructure, a zero-day in Ivanti Connect Secure puts VPN gateways at risk, and researchers demonstrate GPT-4 autonomously writing spear-phishing campaigns with 92% delivery rates.',
 'Stay patched, stay paranoid. — The Cyber Cookie Team'),

(2, '2024-01-22',
 'Change Healthcare Ransomware Fallout, MOVEit Wave Continues, CISA Emergency Directive',
 'UnitedHealth Group''s Change Healthcare subsidiary confirms a ransomware attack disrupting pharmacy systems nationwide. The MOVEit supply-chain breach adds 15 more victim organisations. CISA issues an emergency directive on Ivanti gateway flaws.',
 'Backups are not optional. — The Cyber Cookie Team'),

(3, '2024-01-29',
 'ALPHV/BlackCat Exit Scam, Apple WebKit Zero-Day, EU AI Act Enters Force',
 'The ALPHV ransomware gang pulls an exit scam after allegedly receiving a $22M ransom from Change Healthcare. Apple patches an actively exploited WebKit flaw. The EU AI Act officially enters into force, setting a two-year compliance clock.',
 'Read the fine print. — The Cyber Cookie Team');

-- ============================================================
-- Sections for issue 1
-- ============================================================
INSERT INTO sections (issue_id, section_type, title, body, word_count) VALUES

(1, 'breach_of_the_day', 'Microsoft Hit by Midnight Blizzard',
 'The Russian SVR-linked threat actor Midnight Blizzard (Cozy Bear) gained access to a legacy OAuth test account at Microsoft in January 2024, then used it to pivot into corporate email inboxes — including senior leadership and security teams. The attack began in November 2023 and was detected in January. Microsoft confirmed no customer data was exfiltrated in this phase, but the breach highlighted risks from legacy, non-MFA-protected accounts sitting inside enterprise tenants.',
 85),

(1, 'vulnerability_watch', 'Ivanti Connect Secure Zero-Days (CVE-2024-21887 & CVE-2024-21893)',
 'Two vulnerabilities in Ivanti Connect Secure and Ivanti Policy Secure are being chained in the wild. CVE-2024-21887 (command injection, CVSS 9.1) combined with CVE-2024-21893 (SSRF, CVSS 8.2) allows an unauthenticated attacker to execute arbitrary commands. Thousands of gateways are internet-exposed. Ivanti released patches; CISA added both to KEV.',
 72),

(1, 'defenders_corner', 'Hunting for Legacy OAuth Apps in Entra ID',
 'The Microsoft breach is a reminder that forgotten service accounts and OAuth apps are a persistent blind spot. Use Microsoft Entra''s App Registrations audit to enumerate apps with delegated permissions older than 90 days. Revoke any that don''t have an owner or a documented business case. Layer conditional access policies that block legacy authentication protocols (IMAP, POP3, basic auth) at the tenant level.',
 68),

(1, 'ai_emerging_threats', 'GPT-4 Writes Spear-Phishing Campaigns with 92% Open Rate',
 'Researchers at UIUC published a study showing that GPT-4, given only a LinkedIn profile, can generate personalised spear-phishing emails that achieve a 92% open rate in controlled simulations — compared to 54% for human-written lures. The model required no fine-tuning. The researchers withheld the exact prompts but note the technique is reproducible with public APIs. Email security vendors are scrambling to update models.',
 73),

(1, 'compliance_pulse', 'SEC Cyber Disclosure Rules Take Effect',
 'Public companies must now report material cybersecurity incidents to the SEC within four business days of determining materiality. The rule also requires annual disclosure of cybersecurity risk management programmes. Legal teams should align IR playbooks with the new disclosure thresholds — "material" is not defined by the SEC but benchmarked against reasonable investor impact.',
 60);

-- ============================================================
-- Sections for issue 2
-- ============================================================
INSERT INTO sections (issue_id, section_type, title, body, word_count) VALUES

(2, 'breach_of_the_day', 'Change Healthcare Ransomware: US Pharmacy Network Offline',
 'ALPHV/BlackCat ransomware operators hit Change Healthcare, a UnitedHealth subsidiary that processes ~15 billion healthcare transactions per year. Pharmacies across the US could not verify insurance or fill prescriptions for days. The attack was traced to compromised Citrix credentials without MFA. UnitedHealth has not disclosed the ransom amount.',
 65),

(2, 'vulnerability_watch', 'MOVEit Transfer — New Victims, Ongoing Exploitation',
 'Cl0p''s MOVEit campaign continues to surface new victims months after the initial disclosure. This week: Maximus (8.5 M records), National Student Clearinghouse, and several state government agencies confirmed data exposure. The flaw (CVE-2023-34362, CVSS 9.8) has a patch but unpatched instances remain internet-exposed.',
 58),

(2, 'defenders_corner', 'MFA on Everything: Lessons from Change Healthcare',
 'The Change Healthcare compromise used valid Citrix credentials — MFA was not enforced on the remote access portal. The fix is not glamorous: audit every internet-facing access point for MFA enforcement. Use your VPN/ZTNA logs to find any authentication events using password-only flows. Enforce phishing-resistant MFA (FIDO2/passkeys) on privileged accounts first, then expand.',
 65),

(2, 'ai_emerging_threats', 'CISA Warns of AI-Generated Fraud in Critical Infrastructure',
 'CISA published advisory AA24-038A warning that threat actors are using AI voice-cloning tools to impersonate executives in business email compromise (BEC) and vishing campaigns targeting energy and water utilities. The advisory recommends out-of-band verification for any wire transfer or credential-reset request, regardless of how convincing the caller sounds.',
 62),

(2, 'compliance_pulse', 'CISA Emergency Directive 24-01: Ivanti Gateways',
 'CISA''s ED 24-01 mandated all federal civilian agencies to immediately apply Ivanti mitigations and, if a gateway could not be patched, take it offline. The directive gives agencies 48 hours to report compliance. Commercial entities should treat this as a strong signal to prioritise the Ivanti patches in their own environments, even outside the federal mandate.',
 60);

-- ============================================================
-- Sections for issue 3
-- ============================================================
INSERT INTO sections (issue_id, section_type, title, body, word_count) VALUES

(3, 'breach_of_the_day', 'ALPHV/BlackCat Pulls Exit Scam After $22M Ransom',
 'After reportedly receiving a $22 million ransom payment from Change Healthcare, the ALPHV/BlackCat ransomware group shut down their infrastructure, seized the affiliate panel, and disappeared — an exit scam that left their own affiliates unpaid. The FBI had previously disrupted ALPHV in December 2023; this appears to be a final cash-out. One affiliate has threatened to release 4TB of Change Healthcare patient data independently.',
 78),

(3, 'vulnerability_watch', 'Apple WebKit Zero-Day Exploited in the Wild (CVE-2024-23222)',
 'Apple patched CVE-2024-23222, a type confusion vulnerability in WebKit that allows arbitrary code execution via a malicious web page. The flaw affects iOS, iPadOS, macOS Ventura, and Safari. Apple confirmed it is aware of a report that this issue may have been actively exploited. Update to iOS 17.3, macOS 14.3, or Safari 17.3 immediately.',
 70),

(3, 'defenders_corner', 'Apple Device Fleet: Enforcing Rapid Security Response',
 'Apple''s Rapid Security Response (RSR) feature allows critical patches to be pushed without a full OS update — but it must be enabled in MDM policy. If you manage Apple devices via Jamf, Mosyle, or another MDM, verify your configuration profile allows RSR. With zero-days arriving faster than traditional patch cycles, RSR is one of the highest-ROI controls for Apple-heavy organisations.',
 68),

(3, 'ai_emerging_threats', 'EU AI Act: What Security Teams Need to Know',
 'The EU AI Act officially entered into force this week. High-risk AI systems — including those used in critical infrastructure, employment, and law enforcement — face mandatory conformity assessments, transparency requirements, and incident reporting obligations within 72 hours. Security teams at affected organisations should begin mapping AI systems to risk categories now; the compliance deadline for high-risk systems is August 2026.',
 75),

(3, 'compliance_pulse', 'NIST CSF 2.0 Released: New "Govern" Function',
 'NIST released Cybersecurity Framework 2.0, the first major update since 2018. The headline addition is a sixth function — Govern — covering roles, responsibilities, policy, and oversight. Organisations already mapped to CSF 1.1 should review the Govern subcategories and identify gaps in their board-level cyber governance documentation. NIST also expanded guidance for supply chain risk (now a top-level category).',
 72);

-- ============================================================
-- CVEs (linked to vulnerability_watch sections)
-- ============================================================

-- Get section IDs dynamically
INSERT INTO cves (section_id, cve_id, product_name, product_blurb, cvss_score, severity, root_cause, attack_vector, detection_notes, recommended_actions)
SELECT s.id,
       'CVE-2024-21887',
       'Ivanti Connect Secure',
       'SSL VPN gateway used by enterprises for remote access. Widely deployed across critical infrastructure and financial services sectors.',
       9.1, 'critical',
       'Insufficient input validation in the web component allows an authenticated administrator to send specially crafted requests to execute arbitrary commands on the appliance.',
       'Network — requires valid session cookie, but can be chained with CVE-2024-21893 for pre-auth exploitation.',
       'Look for unusual outbound connections from the Ivanti appliance IP. Hunt for new XML files in /data/runtime/tmp/tt/ and unexpected cron jobs.',
       'Apply Ivanti patch immediately. If unpatched, follow Ivanti''s factory-reset guidance — the integrity checker alone is insufficient post-compromise. Add Ivanti IPs to heightened monitoring.'
FROM sections s
JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 1 AND s.section_type = 'vulnerability_watch';

INSERT INTO cves (section_id, cve_id, product_name, product_blurb, cvss_score, severity, root_cause, attack_vector, detection_notes, recommended_actions)
SELECT s.id,
       'CVE-2024-21893',
       'Ivanti Policy Secure',
       'Network access control product that enforces endpoint compliance before granting VPN access. Often co-deployed with Connect Secure.',
       8.2, 'high',
       'Server-Side Request Forgery (SSRF) in the SAML component allows an unauthenticated attacker to access restricted resources on the appliance.',
       'Network — unauthenticated. No credentials required. Combine with CVE-2024-21887 for full RCE chain.',
       'Monitor SAML authentication logs for malformed assertions. IDS signatures are available from Volexity and Mandiant.',
       'Patch to the latest Ivanti release. Isolate the management interface behind a jump host. Rotate all service account credentials configured in the gateway.'
FROM sections s
JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 1 AND s.section_type = 'vulnerability_watch';

INSERT INTO cves (section_id, cve_id, product_name, product_blurb, cvss_score, severity, root_cause, attack_vector, detection_notes, recommended_actions)
SELECT s.id,
       'CVE-2023-34362',
       'MOVEit Transfer',
       'Managed file transfer application used by thousands of enterprises and government agencies to move large files internally and with partners.',
       9.8, 'critical',
       'SQL injection in the MOVEit Transfer web application allows an unauthenticated attacker to gain elevated privileges and access the database.',
       'Network — unauthenticated HTTP POST request to the web application.',
       'Query MOVEit logs for unexpected activity against the /guestaccess.aspx endpoint. Hunt for new admin accounts or scheduled tasks created around the time of compromise.',
       'Apply MOVEit patches. Audit all user accounts for unexpected additions. Review file transfer logs for exfiltration. Consider blocking internet exposure of MOVEit entirely if not required.'
FROM sections s
JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 2 AND s.section_type = 'vulnerability_watch';

INSERT INTO cves (section_id, cve_id, product_name, product_blurb, cvss_score, severity, root_cause, attack_vector, detection_notes, recommended_actions)
SELECT s.id,
       'CVE-2024-23222',
       'Apple WebKit',
       'The browser engine used by Safari and all iOS browsers. Any app using WKWebView is also affected, making the attack surface extremely broad.',
       8.8, 'high',
       'Type confusion vulnerability in WebKit''s JavaScript engine. Processing malicious web content causes the engine to misinterpret object types, leading to memory corruption and arbitrary code execution.',
       'Remote — user must visit a malicious web page. No user interaction beyond page load required after navigation.',
       'Enable Rapid Security Response in MDM. Look for Safari crashes or unexpected process spawns from WebContent process in endpoint telemetry.',
       'Update to iOS 17.3 / macOS Ventura 13.6.4 / Safari 17.3. Enable Lockdown Mode on high-risk individuals (journalists, executives). Ensure MDM policy permits Rapid Security Response.'
FROM sections s
JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 3 AND s.section_type = 'vulnerability_watch';

-- ============================================================
-- Sources
-- ============================================================
INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'Microsoft Security Blog', 'https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 1 AND s.section_type = 'breach_of_the_day';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'Ivanti Advisory', 'https://forums.ivanti.com/s/article/CVE-2024-21887'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 1 AND s.section_type = 'vulnerability_watch';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'CISA KEV', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 1 AND s.section_type = 'vulnerability_watch';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'UnitedHealth Group Press Release', 'https://ir.unitedhealthgroup.com/news-releases/news-release-details/unitedhealth-group-statement-change-healthcare-cyber-incident'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 2 AND s.section_type = 'breach_of_the_day';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'CISA Emergency Directive 24-01', 'https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 2 AND s.section_type = 'compliance_pulse';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'Krebs on Security', 'https://krebsonsecurity.com/2024/03/blackcat-ransomware-group-implodes-after-apparent-22m-ransom-payment-by-change-healthcare/'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 3 AND s.section_type = 'breach_of_the_day';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'Apple Security Updates', 'https://support.apple.com/en-us/111900'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 3 AND s.section_type = 'vulnerability_watch';

INSERT INTO sources (section_id, source_name, url)
SELECT s.id, 'NIST CSF 2.0', 'https://www.nist.gov/cyberframework'
FROM sections s JOIN issues i ON s.issue_id = i.id
WHERE i.issue_number = 3 AND s.section_type = 'compliance_pulse';

-- ============================================================
-- Tags
-- ============================================================
INSERT INTO tags (name) VALUES
  ('ransomware'), ('nation-state'), ('zero-day'), ('supply-chain'),
  ('ai-threats'), ('phishing'), ('patch-now'), ('apple'), ('ivanti'),
  ('moveit'), ('healthcare'), ('compliance'), ('eu-ai-act'), ('cisa');

-- Tag sections
INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 1 AND s.section_type = 'breach_of_the_day' AND t.name = 'nation-state';

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 1 AND s.section_type = 'vulnerability_watch' AND t.name IN ('zero-day','ivanti','patch-now');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 1 AND s.section_type = 'ai_emerging_threats' AND t.name IN ('ai-threats','phishing');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 2 AND s.section_type = 'breach_of_the_day' AND t.name IN ('ransomware','healthcare');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 2 AND s.section_type = 'vulnerability_watch' AND t.name IN ('supply-chain','moveit','patch-now');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 2 AND s.section_type = 'compliance_pulse' AND t.name IN ('cisa','patch-now');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 3 AND s.section_type = 'breach_of_the_day' AND t.name IN ('ransomware','healthcare');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 3 AND s.section_type = 'vulnerability_watch' AND t.name IN ('zero-day','apple','patch-now');

INSERT INTO section_tags (section_id, tag_id)
SELECT s.id, t.id FROM sections s JOIN issues i ON s.issue_id = i.id, tags t
WHERE i.issue_number = 3 AND s.section_type = 'compliance_pulse' AND t.name IN ('compliance','eu-ai-act');
