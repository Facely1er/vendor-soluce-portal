\## BUSINESS ASSOCIATE AGREEMENT (BAA)\
\
\*\*Effective Date:\*\* \[[TIME OF PURCHASE]{.mark}\] \
\*\*Last Updated:\*\* October 31, 2025\
\
This Business Associate Agreement ("BAA") is entered into between ERMITS
LLC ("Business Associate" or "ERMITS") and the healthcare entity using
ERMITS Services ("Covered Entity" or "Customer") and supplements the
Master Terms of Service.\
\
This BAA is required under the Health Insurance Portability and
Accountability Act of 1996 ("HIPAA"), as amended by the Health
Information Technology for Economic and Clinical Health Act ("HITECH
Act"), and their implementing regulations.\
\
\### 1.1 Definitions\
\
Terms used but not defined in this BAA have the meanings set forth in 45
CFR §§ 160.103 and 164.501.\
\
\*\*"Breach"\*\* means the acquisition, access, use, or disclosure of
Protected Health Information in a manner not permitted under the Privacy
Rule which compromises the security or privacy of the Protected Health
Information.\
\
\*\*"Business Associate"\*\* means ERMITS LLC, which creates, receives,
maintains, or transmits Protected Health Information on behalf of
Covered Entity.\
\
\*\*"Covered Entity"\*\* means Customer, a healthcare provider, health
plan, or healthcare clearinghouse subject to HIPAA.\
\
\*\*"Protected Health Information" or "PHI"\*\* means individually
identifiable health information transmitted or maintained in any form or
medium by Business Associate on behalf of Covered Entity, excluding
education records covered by FERPA and employment records held by
Covered Entity in its role as employer.\
\
\*\*"Required by Law"\*\* means a mandate contained in law that compels
an entity to make a use or disclosure of Protected Health Information.\
\
\*\*"Security Incident"\*\* means the attempted or successful
unauthorized access, use, disclosure, modification, or destruction of
information or interference with system operations.\
\
\*\*"Services"\*\* means ERMITS products and services as defined in the
Master Terms of Service.\
\
\*\*"Subcontractor"\*\* means a person or entity to whom Business
Associate delegates a function, activity, or service involving the use
or disclosure of PHI.\
\
\*\*"Unsecured Protected Health Information"\*\* means PHI that is not
rendered unusable, unreadable, or indecipherable to unauthorized persons
through the use of a technology or methodology specified by HHS.\
\
\### 1.2 Scope and Applicability\
\
\*\*1.2.1 Application\*\*\
\
This BAA applies when:\
\
- Customer is a Covered Entity or Business Associate under HIPAA\
- Customer uses Services to create, receive, maintain, or transmit PHI\
- HIPAA regulations require a Business Associate Agreement\
\
\*\*1.2.2 Privacy-First Architecture and PHI\*\*\
\
\*\*CRITICAL LIMITATION:\*\* Due to ERMITS' Privacy-First Architecture:\
\
- \*\*PHI is NOT transmitted to ERMITS servers\*\* - All PHI Processing
occurs client-side on Customer's devices\
- \*\*ERMITS cannot access PHI\*\* - Zero-knowledge encryption prevents
ERMITS from viewing PHI stored in cloud\
- \*\*Limited PHI exposure\*\* - ERMITS only has access to account
information (name, email), not clinical or health data\
- \*\*Customer retains control\*\* - Customer is responsible for PHI
security through deployment choices\
\
\*\*Recommended Configuration for HIPAA Compliance:\*\*\
\
- Use \*\*local-only storage\*\* (browser or desktop) for all PHI\
- Use \*\*self-managed cloud infrastructure\*\* (Customer controls
environment)\
- Enable \*\*client-side encryption\*\* for any cloud-stored data\
- Implement \*\*access controls\*\* per HIPAA Security Rule\
- Maintain \*\*audit logs\*\* of PHI access\
\
\*\*ERMITS' role is limited\*\* to providing secure infrastructure and
tools; Customer remains primarily responsible for HIPAA compliance.\
\
\### 1.3 Permitted Uses and Disclosures of PHI\
\
\*\*1.3.1 General Use and Disclosure Provisions\*\*\
\
Business Associate may use or disclose PHI only:\
\
- As permitted or required by this BAA\
- As required by law\
- As directed by Covered Entity in writing\
- To perform Services on behalf of Covered Entity\
\
Business Associate shall not use or disclose PHI in any manner that
would violate the HIPAA Privacy Rule if done by Covered Entity.\
\
\*\*1.3.2 Specific Permitted Uses\*\*\
\
\*\*Service Delivery:\*\*\
\
- Provide and maintain the Services\
- Technical support and troubleshooting\
- System administration and security monitoring\
- Service improvement (using de-identified data only)\
\
\*\*Legal Requirements:\*\*\
\
- Comply with legal obligations\
- Respond to lawful requests (with notice to Covered Entity when
permitted)\
\
\*\*Business Operations:\*\*\
\
- Business management and general administrative activities\
- Legal and compliance functions\
- Fraud and abuse detection and compliance programs\
\
\*\*1.3.3 Prohibited Uses\*\*\
\
Business Associate shall NOT:\
\
- Use PHI for marketing purposes\
- Sell PHI\
- Use PHI for purposes other than providing Services\
- Disclose PHI to third parties without authorization\
- Use PHI for Business Associate's own purposes (except as permitted by
law)\
\
\*\*Note:\*\* Due to Privacy-First Architecture, ERMITS typically does
not have access to PHI content, making most unauthorized uses
technically impossible.\
\
\### 1.4 Obligations of Business Associate\
\
\*\*1.4.1 Compliance with HIPAA\*\*\
\
Business Associate shall:\
\
- Comply with applicable HIPAA Privacy Rule requirements (45 CFR Part
164, Subpart E)\
- Comply with applicable HIPAA Security Rule requirements (45 CFR Part
164, Subpart C)\
- Comply with HITECH Act provisions applicable to Business Associates\
- Not use or disclose PHI except as permitted by this BAA\
\
\*\*1.4.2 Safeguards\*\*\
\
Business Associate shall implement appropriate administrative, physical,
and technical safeguards to prevent use or disclosure of PHI other than
as provided by this BAA.\
\
\*\*Administrative Safeguards:\*\*\
\
- Security management process\
- Assigned security responsibility\
- Workforce security and training\
- Information access management\
- Security awareness and training\
- Security incident procedures\
- Contingency planning\
- Business associate contracts and agreements\
\
\*\*Physical Safeguards:\*\*\
\
- Facility access controls (where applicable)\
- Workstation security\
- Device and media controls\
- Secure data center operations (Supabase, Vercel)\
\
\*\*Technical Safeguards:\*\*\
\
- Access controls (unique user identification, emergency access
procedures)\
- Audit controls and logging\
- Integrity controls\
- Transmission security (encryption)\
- Authentication mechanisms (MFA available)\
- Encryption at rest and in transit\
\
\*\*Privacy-First Safeguards:\*\*\
\
- Client-side PHI processing\
- Zero-knowledge encryption architecture\
- Local storage options\
- Row-level security in database\
- Pseudonymization of analytics data\
\
\*\*1.4.3 Reporting\*\*\
\
\*\*Security Incident Reporting:\*\*\
Business Associate shall report to Covered Entity:\
\
- Any use or disclosure of PHI not permitted by this BAA\
- Any Security Incident of which Business Associate becomes aware\
- Discovery of Breach of Unsecured PHI\
\
\*\*Timeline:\*\*\
\
- Without unreasonable delay\
- In no case later than 10 business days after discovery\
- Via email to Covered Entity's designated contact\
\
\*\*Information to Include:\*\*\
\
- Date of incident\
- Nature of incident\
- PHI involved (if known)\
- Steps taken to mitigate\
- Recommendations for Covered Entity\
- Contact information for questions\
\
\*\*Note:\*\* Business Associate is not required to report routine
Security Incidents such as pings, port scans, unsuccessful login
attempts, or denial-of-service attacks that do not result in
unauthorized access, use, or disclosure of PHI.\
\
\*\*1.4.4 Breach Notification\*\*\
\
\*\*Discovery and Investigation:\*\*\
\
- Business Associate will investigate suspected Breaches\
- Document findings and determination\
- Notify Covered Entity without unreasonable delay\
\
\*\*Notification to Covered Entity:\*\*\
Business Associate shall notify Covered Entity of Breach:\
\
- Within 10 business days of discovery\
- Include required HITECH Act information:\
  - Identification of each individual affected\
  - Description of unauthorized acquisition, access, use, or disclosure\
  - Type of PHI involved\
  - Steps individuals should take to protect themselves\
  - Steps Business Associate is taking\
  - Contact information\
\
\*\*Covered Entity Responsibility:\*\*\
\
- Covered Entity is responsible for notifying affected individuals\
- Covered Entity is responsible for notifying HHS and media (if
required)\
- Business Associate will cooperate and provide information\
\
\*\*1.4.5 Subcontractors\*\*\
\
\*\*Written Agreements Required:\*\*\
Business Associate shall ensure that any Subcontractor that creates,
receives, maintains, or transmits PHI on behalf of Business Associate
agrees in writing to:\
\
- Comply with same restrictions and conditions applicable to Business
Associate\
- Implement appropriate safeguards for PHI\
- Report Breaches and Security Incidents\
\
\*\*Current Subcontractors:\*\*\
\
\|Subcontractor\|Service           \|PHI Access               
 \|Agreement Status  \|\
\|\-\-\-\-\-\-\-\-\-\-\-\--\|\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--\|\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--\|\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--\|\
\|Supabase Inc.\|Database hosting  \|Encrypted only             \|BAA in
place      \|\
\|Vercel Inc.  \|Hosting/CDN       \|IP addresses only (not PHI)\|BAA in
place      \|\
\|Stripe Inc.  \|Payment processing\|No PHI access             
\|Standard agreement\|\
\
\*\*Note:\*\* Most Subcontractors have NO access to PHI due to
Privacy-First Architecture. Encrypted PHI in Supabase cannot be
decrypted by Subcontractor.\
\
\*\*Changes to Subcontractors:\*\*\
\
- 30 days advance notice to Covered Entity\
- Opportunity to object to new Subcontractors\
- Alternative arrangements if objection not resolved\
\
\*\*1.4.6 Access to PHI\*\*\
\
\*\*Covered Entity Access Rights:\*\*\
Business Associate shall provide access to PHI in its possession to
Covered Entity or, as directed by Covered Entity, to an individual to
meet requirements under 45 CFR § 164.524.\
\
\*\*Timeline:\*\*\
\
- Within 10 business days of request\
- In the form and format requested (if readily producible)\
- If not readily producible, in readable hard copy or other agreed
format\
\
\*\*Privacy-First Architecture:\*\*\
\
- Most PHI resides locally on Customer's devices (Customer already has
access)\
- Encrypted cloud PHI can be exported by Customer via Account Settings\
- Business Associate cannot decrypt or access Customer's PHI\
\
\*\*1.4.7 Amendment of PHI\*\*\
\
Business Associate shall make PHI available for amendment and
incorporate amendments to PHI as directed by Covered Entity in
accordance with 45 CFR § 164.526.\
\
\*\*Process:\*\*\
\
- Covered Entity directs amendment\
- Business Associate implements within 10 business days\
- Business Associate documents amendment\
\
\*\*Privacy-First Architecture:\*\*\
\
- Customer can directly amend PHI in local storage\
- Customer can amend encrypted cloud data\
- Business Associate assistance limited to technical support\
\
\*\*1.4.8 Accounting of Disclosures\*\*\
\
Business Associate shall document and make available to Covered Entity
information required to provide an accounting of disclosures in
accordance with 45 CFR § 164.528.\
\
\*\*Required Information:\*\*\
\
- Date of disclosure\
- Name and address of recipient\
- Brief description of PHI disclosed\
- Brief statement of purpose\
\
\*\*Timeline:\*\*\
\
- Provide information within 10 business days of request\
- For period specified by Covered Entity (up to 6 years)\
\
\*\*Exceptions:\*\*\
\
- Disclosures for treatment, payment, operations\
- Disclosures to the individual\
- Disclosures pursuant to authorization\
- Disclosures for facility directory or to persons involved in care\
- Disclosures for national security purposes\
- Disclosures to correctional institutions or law enforcement\
\
\*\*Privacy-First Architecture:\*\*\
\
- Business Associate typically has no PHI disclosures to account for\
- Customer maintains direct control over PHI disclosures\
- Technical logs available for Customer's accounting purposes\
\
\*\*1.4.9 Books and Records\*\*\
\
Business Associate shall make internal practices, books, and records
relating to use and disclosure of PHI available to HHS for purposes of
determining Covered Entity's compliance with HIPAA.\
\
\*\*Availability:\*\*\
\
- Upon reasonable request\
- During normal business hours\
- In format specified by HHS\
- At location specified by HHS\
\
\### 1.5 Obligations of Covered Entity\
\
\*\*1.5.1 Permissible Requests\*\*\
\
Covered Entity shall not request Business Associate to use or disclose
PHI in any manner that would violate HIPAA if done by Covered Entity.\
\
\*\*1.5.2 Notice of Privacy Practices\*\*\
\
Covered Entity shall notify Business Associate of any:\
\
- Limitations in Notice of Privacy Practices affecting Business
Associate's use or disclosure of PHI\
- Changes to Covered Entity's Notice of Privacy Practices\
\
\*\*1.5.3 Permission for Use and Disclosure\*\*\
\
Covered Entity shall notify Business Associate of any:\
\
- Revocation of patient authorization affecting Business Associate's use
or disclosure\
- Restriction on use or disclosure agreed to by Covered Entity affecting
Business Associate\
\
\*\*1.5.4 Lawful Instructions\*\*\
\
Covered Entity shall provide instructions for PHI use and disclosure
that are:\
\
- In writing\
- Consistent with HIPAA requirements\
- Technically feasible for Business Associate\
\
\*\*1.5.5 Proper Configuration\*\*\
\
Covered Entity is responsible for:\
\
- Configuring Services for HIPAA compliance\
- Using appropriate deployment options (local or self-managed)\
- Implementing required access controls\
- Maintaining audit logs\
- Training workforce on HIPAA requirements\
- Obtaining required Business Associate Agreements with its customers
(if applicable)\
\
\### 1.6 Term and Termination\
\
\*\*1.6.1 Term\*\*\
\
This BAA is effective as of the Effective Date and shall remain in
effect until terminated.\
\
\*\*1.6.2 Termination for Cause\*\*\
\
\*\*Covered Entity Right to Terminate:\*\*\
If Covered Entity determines Business Associate has violated a material
term of this BAA:\
\
\*\*Step 1 - Reasonable Steps:\*\*\
Covered Entity shall either:\
\
- Provide opportunity for Business Associate to cure breach (reasonable
timeframe)\
- Immediately terminate if cure not possible\
\
\*\*Step 2 - Termination:\*\*\
If cure is not possible or breach is not cured:\
\
- Terminate Services agreement\
- Terminate this BAA\
\
\*\*Step 3 - HHS Notification:\*\*\
If termination is not feasible, Covered Entity shall:\
\
- Report problem to HHS Secretary\
\
\*\*Business Associate Right to Terminate:\*\*\
Business Associate may terminate if:\
\
- Covered Entity requests unlawful use or disclosure\
- Covered Entity materially breaches this BAA\
- Termination provisions in Master Terms of Service apply\
\
\*\*1.6.3 Effect of Termination\*\*\
\
\*\*PHI Disposition:\*\*\
Upon termination, Business Associate shall:\
\
- Return or destroy all PHI received from Covered Entity (if feasible)\
- Retain no copies of PHI (except as required by law)\
- Provide written certification of destruction or return\
\
\*\*If Return or Destruction Not Feasible:\*\*\
\
- Extend protections of this BAA to PHI\
- Limit further uses and disclosures\
- Document reasons return/destruction not feasible\
- Return or destroy PHI when feasible\
\
\*\*Privacy-First Architecture:\*\*\
\
- Most PHI resides on Customer's devices (automatic retention)\
- Encrypted cloud PHI can be exported by Customer before termination\
- Business Associate has limited PHI to return/destroy\
\
\*\*Survival:\*\*\
\
- Confidentiality obligations survive\
- Audit rights survive for reasonable period\
- Return/destruction obligations survive\
\
\### 1.7 Minimum Necessary\
\
\*\*1.7.1 Minimum Necessary Standard\*\*\
\
Business Associate shall make reasonable efforts to:\
\
- Use, disclose, and request only the minimum necessary PHI to
accomplish intended purpose\
- Limit access to PHI to workforce members requiring access\
\
\*\*Privacy-First Architecture Advantage:\*\*\
\
- Zero-knowledge encryption inherently limits access\
- Client-side processing minimizes PHI exposure\
- Role-based access controls limit workforce access\
\
\*\*1.7.2 Exception\*\*\
\
Minimum necessary requirement does not apply to:\
\
- Disclosures to or requests by healthcare providers for treatment\
- Uses or disclosures made to the individual\
- Uses or disclosures required by law\
- Disclosures to HHS for compliance review\
\
\### 1.8 Data Ownership\
\
\*\*PHI Ownership:\*\*\
\
- All PHI remains property of Covered Entity\
- Business Associate has no ownership interest in PHI\
- Business Associate's role is limited to providing services\
\
\*\*De-identified Data:\*\*\
Business Associate may create and use de-identified data (per 45 CFR §
164.514) for:\
\
- Service improvement\
- Research and analytics\
- Product development\
\
Provided that:\
\
- De-identification meets HIPAA standards\
- No re-identification attempted\
- Covered Entity's privacy obligations not violated\
\
\### 1.9 Regulatory Changes\
\
\*\*1.9.1 Amendment for Compliance\*\*\
\
Parties agree to amend this BAA to comply with:\
\
- Changes to HIPAA regulations\
- HHS guidance\
- Other applicable laws\
\
\*\*Process:\*\*\
\
- Either party may propose amendments\
- Good faith negotiation required\
- If amendment not agreed, either party may terminate\
\
\*\*1.9.2 Ambiguities\*\*\
\
If conflict between this BAA and HIPAA regulations:\
\
- HIPAA regulations control\
- This BAA construed to comply with HIPAA\
\
\### 1.10 Liability and Indemnification\
\
\*\*1.10.1 Business Associate Liability\*\*\
\
Business Associate is liable for:\
\
- Civil penalties for violations (up to \$25,000 per violation type per
year)\
- Criminal penalties if applicable (up to \$250,000 and 10 years
imprisonment)\
- Damages to Covered Entity resulting from Business Associate's breach\
\
\*\*Limitation:\*\*\
Subject to limitations in Master Terms of Service, except:\
\
- No limitation for gross negligence or willful misconduct\
- No limitation for HIPAA regulatory penalties\
\
\*\*1.10.2 Covered Entity Liability\*\*\
\
Covered Entity remains responsible for:\
\
- Compliance with HIPAA as Covered Entity\
- Proper use of Services in HIPAA-compliant manner\
- Training its workforce\
- Obtaining required authorizations\
- Notifying affected individuals and HHS of Breaches\
\
\*\*1.10.3 Indemnification\*\*\
\
Business Associate shall indemnify Covered Entity for:\
\
- Claims arising from Business Associate's breach of this BAA\
- Business Associate's violation of HIPAA\
- Business Associate's negligence or misconduct\
\
Covered Entity shall indemnify Business Associate for:\
\
- Claims arising from Covered Entity's breach of this BAA\
- Covered Entity's violation of HIPAA\
- Covered Entity's negligence or misconduct\
- Covered Entity's improper configuration or use of Services\
\
\### 1.11 Individual Rights\
\
\*\*1.11.1 Right to Access\*\*\
\
Business Associate shall provide PHI access to enable Covered Entity to
respond to individual requests within timeframes required by HIPAA (30
days, with one 30-day extension).\
\
\*\*1.11.2 Right to Amendment\*\*\
\
Business Associate shall cooperate with Covered Entity to amend PHI as
required by HIPAA.\
\
\*\*1.11.3 Right to Accounting\*\*\
\
Business Associate shall provide information for accounting of
disclosures as required by 45 CFR § 164.528.\
\
\*\*1.11.4 Right to Restriction\*\*\
\
Business Associate shall comply with restrictions on use and disclosure
agreed to by Covered Entity and communicated to Business Associate.\
\
\### 1.12 Breach Notification Rule\
\
\*\*1.12.1 HITECH Act Requirements\*\*\
\
Business Associate shall comply with breach notification requirements
under 45 CFR §§ 164.400-414.\
\
\*\*1.12.2 Notification Requirements\*\*\
\
Following discovery of Breach of Unsecured PHI, Business Associate shall
notify Covered Entity within 10 business days with:\
\
- Description of Breach\
- Types of PHI involved\
- Steps individuals should take\
- Steps Business Associate is taking\
- Contact information\
\
\*\*1.12.3 Covered Entity Responsibilities\*\*\
\
Covered Entity is responsible for:\
\
- Notifying affected individuals (without unreasonable delay, no later
than 60 days)\
- Notifying HHS (if 500+ individuals affected, within 60 days)\
- Notifying media (if 500+ individuals in jurisdiction affected)\
\
Business Associate shall cooperate and provide necessary information.\
\
\### 1.13 Patient Safety and Quality\
\
Business Associate acknowledges that PHI may be used by Covered Entity
for:\
\
- Patient safety activities\
- Quality assessment and improvement\
- Population-based activities relating to health\
- Protocol development and case management\
\
Business Associate shall not interfere with these activities.\
\
\### 1.14 Miscellaneous\
\
\*\*1.14.1 Regulatory References\*\*\
\
References to HIPAA regulations include:\
\
- HIPAA Privacy Rule (45 CFR Part 164, Subpart E)\
- HIPAA Security Rule (45 CFR Part 164, Subpart C)\
- HIPAA Breach Notification Rule (45 CFR §§ 164.400-414)\
- HITECH Act provisions\
\
\*\*1.14.2 Interpretation\*\*\
\
This BAA shall be interpreted to:\
\
- Permit compliance with HIPAA\
- Not require violation of HIPAA\
- Resolve ambiguities in favor of compliance\
\
\*\*1.14.3 No Third-Party Beneficiaries\*\*\
\
This BAA does not create third-party beneficiary rights, except:\
\
- Individuals have right to enforce certain provisions per HITECH Act\
\
\*\*1.14.4 Integration with Master Terms\*\*\
\
- This BAA supplements Master Terms of Service\
- In case of conflict, this BAA controls for HIPAA matters\
- Both agreements read together\
\
\*\*1.14.5 Entire Agreement\*\*\
\
This BAA, together with Master Terms of Service, constitutes entire
agreement regarding PHI.\
\
\### 1.15 Notices\
\
All notices under this BAA shall be in writing:\
\
\*\*To Business Associate:\*\*\
ERMITS LLC \
\[INSERT ADDRESS\] \
Email: <contact@ermits.com> \
Subject: "BAA Notice - \[Matter\]"\
\
\*\*To Covered Entity:\*\*\
As specified in Covered Entity's account settings or as otherwise
provided in writing.\
\
\### 1.16 Contact Information\
\
\*\*HIPAA Compliance Questions:\*\*\
Email: <contact@ermits.com> \
Subject: "HIPAA Compliance Inquiry"\
\
\*\*Breach Notification:\*\*\
Email: <contact@ermits.com> \
Subject: "URGENT: HIPAA Breach Notification"\
\
\*\*Privacy Officer:\*\*\
Email: <contact@ermits.com> \
Subject: "HIPAA Privacy Matter"\
\
\*\*Security Officer:\*\*\
Email: <contact@ermits.com> \
Subject: "HIPAA Security Matter"\
\
\-\-\-\--\
\
\## EXECUTION\
\
This Business Associate Agreement is effective as of the Effective
Date.\
\
\*\*By using ERMITS Services to create, receive, maintain, or transmit
PHI, Covered Entity agrees to the terms of this BAA.\*\*\
\
\*\*For signed BAA (Enterprise healthcare customers):\*\*\
Contact: <contact@ermits.com> \
Subject: "Request Signed BAA"\
\
\-\-\-\--\
\
\*\*Document Version:\*\* 1.0 \
\*\*Last Updated:\*\* January 2025 \
\*\*Status:\*\* Draft - Requires Legal and HIPAA Compliance Review\
\
\*\*ERMITS LLC\*\* \
Email: <contact@ermits.com> \
Website: [www.ermits.com](http://www.ermits.com)\
\
\-\-\-\--\
\
\## IMPORTANT NOTICE FOR COVERED ENTITIES\
\
\*\*Privacy-First Architecture and HIPAA Compliance:\*\*\
\
ERMITS' Privacy-First Architecture is designed to minimize PHI exposure,
but Covered Entities must:\
\
\*\*Configure Services appropriately\*\* - Use local or self-managed
storage for PHI \
\*\*Enable encryption\*\* - Use client-side encryption for any
cloud-stored PHI \
\*\*Implement access controls\*\* - Per HIPAA Security Rule
requirements \
\*\*Train workforce\*\* - On proper use of Services with PHI \
\*\*Maintain audit logs\*\* - Document PHI access and use \
\*\*Conduct risk analysis\*\* - Assess risks specific to your
implementation\
\
\*\*ERMITS provides tools and infrastructure; Covered Entity remains
responsible for HIPAA compliance.\*\*
