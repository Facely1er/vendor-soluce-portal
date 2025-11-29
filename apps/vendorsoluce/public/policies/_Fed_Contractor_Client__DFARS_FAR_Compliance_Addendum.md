# ERMITS LLC DFARS/FAR COMPLIANCE ADDENDUM FOR FEDERAL CONTRACTORS

**Effective Date: October 31, 2025**

**Last Updated: October 31, 2025**

This DFARS/FAR Compliance Addendum (\"Addendum\") supplements and
modifies the ERMITS LLC Master Terms of Service, Master Privacy Policy,
and other applicable policies (collectively, \"Master Policies\") for
users who are U.S. federal contractors or subcontractors subject to the
Federal Acquisition Regulation (FAR) and Defense Federal Acquisition
Regulation Supplement (DFARS). This Addendum takes precedence over
conflicting provisions in the Master Policies to the extent necessary
for DFARS/FAR compliance.

**IMPORTANT:** This Addendum applies only to users who are subject to
DFARS and FAR requirements. Standard commercial users should refer to
the Master Policies without this Addendum.

# 1. APPLICABILITY AND SCOPE

## 1.1 When This Addendum Applies

This Addendum applies to your use of ERMITS Services if you are:

-   Prime Contractors:

    -   Organizations holding prime contracts with U.S. federal
        agencies, including Department of Defense (DoD), that require
        compliance with FAR and DFARS clauses

    -   Contractors subject to DFARS 252.204-7012 (Safeguarding Covered
        Defense Information and Cyber Incident Reporting)

    -   Contractors processing Federal Contract Information (FCI)
        subject to FAR 52.204-21

-   Subcontractors:

    -   Organizations performing work under subcontracts that flow down
        DFARS/FAR requirements

    -   Suppliers and vendors in the Defense Industrial Base (DIB)

-   Organizations Subject to CMMC:

    -   Contractors required to achieve CMMC Level 1 or Level 2
        certification

    -   Organizations processing Controlled Unclassified Information
        (CUI) for DoD contracts

## 1.2 Determining Applicability

You are responsible for determining whether this Addendum applies to
your organization based on:

-   Review of your federal contracts and subcontracts for applicable FAR
    and DFARS clauses

-   Consultation with your contracting officer or legal counsel

-   Understanding your obligations under NIST SP 800-171 (if processing
    CUI)

-   Assessment of your CMMC requirements (if applicable)

**ERMITS Disclaimer:** ERMITS does not determine whether DFARS/FAR
clauses apply to your organization. You are solely responsible for
compliance with your contractual obligations. ERMITS provides tools to
assist with compliance but does not guarantee compliance or
certification.

# 2. INCORPORATED DFARS CLAUSES

## 2.1 DFARS 252.204-7012: Safeguarding Covered Defense Information and Cyber Incident Reporting

**Applicability:** This clause applies to contractors and subcontractors
processing, storing, or transmitting Covered Defense Information (CDI),
which includes CUI and other unclassified information requiring
safeguarding.

### 2.1.1 NIST SP 800-171 Compliance Requirements

**Your Obligations:** When using ERMITS Services to process CDI, you
must:

-   Implement NIST SP 800-171 Security Requirements:

    -   Implement all 110 security requirements in NIST SP 800-171 Rev 2
        (or latest revision) applicable to your organization

    -   Document implementation status in System Security Plan (SSP)

    -   Maintain Plans of Action and Milestones (POA&Ms) for controls
        not fully implemented

-   Configure ERMITS Services Appropriately:

    -   Use encryption features for CDI storage (enable client-side
        encryption)

    -   Deploy self-managed infrastructure options for CDI processing
        (on-premises or FedRAMP-equivalent cloud)

    -   Implement multi-factor authentication (MFA) for all user
        accounts

    -   Maintain audit logs as required by NIST SP 800-171 controls (3.3
        Audit and Accountability)

    -   Implement role-based access controls (RBAC) to limit CDI access
        to authorized users

-   Properly Mark and Handle CDI:

    -   Mark CUI in accordance with 32 CFR Part 2002 (CUI Registry and
        marking requirements)

    -   Apply appropriate CUI category markings (e.g., CUI//SP-EXPT for
        export-controlled information)

    -   Ensure all users understand CUI handling obligations

    -   Do not transmit CDI over unsecured channels or store in
        unauthorized locations

**ERMITS Support for NIST SP 800-171:** ERMITS Privacy-First
Architecture supports NIST SP 800-171 compliance through:

-   Client-Side Processing (Control 3.13.2): CDI processed locally on
    your device, not transmitted to ERMITS servers

-   Encryption at Rest (Control 3.13.16): AES-256-GCM encryption for CDI
    stored in ERMITS-managed cloud (when enabled)

-   Encryption in Transit (Control 3.13.8): TLS 1.3 for all data
    transmission

-   Access Control (3.1 family): Multi-factor authentication, role-based
    access control, session management

-   Audit and Accountability (3.3 family): Comprehensive audit logging
    for security-relevant events

-   Identification and Authentication (3.5 family): Unique user
    identification, password policies, MFA

-   Media Protection (3.8 family): Secure deletion capabilities,
    encrypted backups

**Important Limitation:** ERMITS tools assist with NIST SP 800-171
implementation but do not guarantee compliance. You remain responsible
for:

-   Conducting formal compliance assessments

-   Implementing controls outside ERMITS Services (physical security,
    personnel security, etc.)

-   Documenting SSP and POA&Ms

-   Obtaining CMMC certification when required

### 2.1.2 Cyber Incident Reporting Requirements

**Contractor Reporting Obligations:** Per DFARS 252.204-7012, you must
report cyber incidents affecting CDI to DoD within 72 hours.

#### Reportable Cyber Incidents:

Actual or suspected cyber incidents that affect CDI, including:

-   Unauthorized access to CDI or systems containing CDI

-   Malware infections affecting CDI systems

-   Denial-of-service attacks on CDI systems

-   Data breaches or exfiltration of CDI

-   Suspected nation-state or advanced persistent threat (APT) activity

-   Compromised user credentials with CDI access

#### Reporting Timeline and Process:

**72-Hour Reporting Requirement:** You must submit reports to DoD within
72 hours of discovery.

-   Report incidents to DoD via https://dibnet.dod.mil

-   Simultaneously notify your Contracting Officer (CO) and Contracting
    Officer\'s Representative (COR)

-   Preserve forensic evidence and media for DoD review (do not sanitize
    affected systems until authorized)

-   Cooperate with DoD cyber incident damage assessment

-   Submit required supplemental reports and updates

**ERMITS Incident Response Support:** Due to Privacy-First Architecture,
ERMITS has limited visibility into CDI incidents. However, ERMITS will:

-   Provide available audit logs and system logs to assist your
    investigation (pseudonymized, metadata only)

-   Cooperate with authorized DoD incident investigations

-   Provide technical documentation about ERMITS architecture and
    security controls

-   Respond promptly to reasonable information requests related to
    incidents

-   Implement corrective actions if ERMITS Services are determined to
    contribute to incidents

**Critical Limitation:** Because CDI is processed client-side with
zero-knowledge encryption, ERMITS cannot:

-   Detect cyber incidents affecting your CDI (this is your
    responsibility)

-   Access encrypted CDI to assess compromise

-   Report incidents on your behalf (you must report)

-   Provide detailed forensics on CDI access patterns (limited metadata
    available)

### 2.1.3 Media Preservation and Sanitization

**Your Obligations:** Per DFARS 252.204-7012(c)(2), you must:

-   Create and preserve forensic images of affected systems and media
    following a cyber incident

-   Retain media for at least 90 days after submission of final cyber
    incident report

-   Do not sanitize or delete data from affected systems without DoD
    approval

-   Provide media to DoD upon request for damage assessment

-   Properly sanitize CDI upon contract completion or when no longer
    needed (NIST SP 800-88 guidelines)

**ERMITS Data Deletion:** ERMITS provides secure deletion capabilities:

-   User-initiated permanent deletion of data via Account Settings

-   Secure deletion of locally-stored CDI (responsibility of user to
    clear browser storage)

-   Encrypted cloud data deletion within 30 days of user request
    (production systems), 90 days (backups)

-   Data sanitization follows NIST SP 800-88 (cryptographic erasure for
    encrypted data)

**Important:** Due to zero-knowledge encryption, if you lose your
encryption keys, ERMITS cannot recover CDI. This constitutes effective
data sanitization but may complicate incident response. Maintain secure
key backups.

## 2.2 FAR 52.204-21: Basic Safeguarding of Covered Contractor Information Systems

**Applicability:** This clause applies to contractors processing Federal
Contract Information (FCI) that is not intended for public release and
is not CUI. FCI includes information such as:

-   Contract terms, conditions, and specifications

-   Financial data related to federal contracts

-   Contractor performance data and reports

-   Government-furnished information not categorized as CUI

### 2.2.1 NIST SP 800-171 Subset Implementation

FAR 52.204-21 requires implementation of a subset of 15 basic security
requirements derived from NIST SP 800-171:

-   Access Control:

    -   3.1.1: Limit system access to authorized users

    -   3.1.2: Limit system access to authorized transactions and
        functions

        -   Implementation in ERMITS: User authentication (Supabase
            Auth), role-based access control, row-level security

-   Identification and Authentication:

    -   3.5.1: Identify users, processes, and devices

    -   3.5.2: Authenticate users, processes, and devices

        -   Implementation in ERMITS: Unique user accounts, password
            authentication, optional OAuth, optional MFA

-   Media Protection:

    -   3.8.3: Sanitize or destroy information system media before
        disposal or reuse

        -   Implementation in ERMITS: Secure data deletion,
            cryptographic erasure, user-controlled deletion

-   Physical Protection:

    -   3.10.1: Limit physical access to organizational systems

        -   Implementation: User responsibility for devices; ERMITS
            cloud infrastructure has physical security (Supabase/Vercel
            data centers)

-   System and Communications Protection:

    -   3.13.1: Monitor, control, and protect organizational
        communications at external boundaries

    -   3.13.5: Implement subnetworks for publicly accessible components

        -   Implementation in ERMITS: TLS 1.3 encryption, HTTPS-only,
            network segmentation at infrastructure level

-   System and Information Integrity:

    -   3.14.1: Identify, report, and correct system flaws

    -   3.14.2: Provide protection from malicious code

    -   3.14.4: Update malicious code protection mechanisms

    -   3.14.5: Perform periodic scans and real-time scans of files

        -   Implementation in ERMITS: Regular security updates, error
            tracking (Sentry), vulnerability monitoring, user
            responsibility for endpoint protection

**Your Obligations:** You must implement all 15 basic safeguarding
requirements for systems processing FCI. ERMITS tools assist with some
requirements, but you remain responsible for comprehensive
implementation including:

-   Endpoint security (antivirus, malware protection) on devices
    accessing ERMITS

-   Physical security of devices and workspaces

-   User training on security requirements

-   Incident response and system flaw remediation

-   Backup and recovery procedures

## 2.3 DFARS 252.204-7019: Notice of NIST SP 800-171 DoD Assessment Requirements

**Assessment and Scoring:** Contractors subject to NIST SP 800-171 must
conduct assessments and submit scores to DoD via the Supplier
Performance Risk System (SPRS).

### 2.3.1 Assessment Types

-   Basic Assessment (Self-Assessment):

    -   Contractor conducts internal assessment of NIST SP 800-171
        implementation

    -   Calculate assessment score using DoD methodology (-3 to +110
        scale)

    -   Submit score to SPRS (https://www.sprs.csd.disa.mil/)

    -   Update score at least annually or when material changes occur

-   Medium and High Assessments:

    -   Government or third-party assessor conducts evaluation

    -   More rigorous testing and validation

    -   Required for certain high-value or sensitive contracts

**ERMITS Tools for Assessment:** ERMITS CyberCertitude™ products provide
tools to assist with NIST SP 800-171 assessments:

-   CMMC Level 2 Compliance Platform: Comprehensive assessment tools for
    all 110 NIST SP 800-171 controls

-   POA&M Management: Track remediation efforts for unimplemented
    controls

-   SSP Templates: Generate System Security Plans documenting control
    implementation

-   Score Calculation: Calculate SPRS assessment scores using DoD
    methodology

-   Evidence Collection: Organize documentation and evidence for
    assessments

**Important Disclaimer:** ERMITS tools assist with assessment
preparation but:

-   Do not conduct formal DoD assessments (you or certified assessor
    must conduct)

-   Do not guarantee specific assessment scores

-   Are not DoD-certified or endorsed assessment tools

-   Cannot replace professional assessment services

## 2.4 DFARS 252.239-7010: Cloud Computing Services

**Applicability:** If you are using ERMITS cloud-managed services to
process CDI or FCI, this clause governs cloud computing requirements.

### 2.4.1 FedRAMP Authorization Requirements

**ERMITS FedRAMP Status:** ERMITS Services are NOT currently FedRAMP
authorized.

**Implications for Federal Contractors:**

-   If your contract requires FedRAMP authorization for cloud service
    providers:

    -   Do NOT use ERMITS cloud-managed services for CDI/FCI processing

    -   Use self-managed deployment options (on-premises or your own
        FedRAMP-authorized cloud)

    -   Process CDI/FCI exclusively client-side (no cloud storage)

-   If your contract allows non-FedRAMP cloud for FCI (not CUI):

    -   ERMITS cloud services may be appropriate for FCI processing

    -   Verify with your Contracting Officer before proceeding

    -   Enable encryption features and ensure proper safeguards

**Recommended Deployment Models for CDI:**

-   On-Premises Deployment:

    -   Install ERMITS products on your own infrastructure (Enterprise
        license required)

    -   Complete control over data residency and security

    -   Recommended for high-assurance CDI processing

-   Self-Managed Cloud Deployment:

    -   Deploy ERMITS to your FedRAMP-authorized cloud environment (AWS
        GovCloud, Azure Government, etc.)

    -   You maintain full control of cloud infrastructure

    -   ERMITS provides deployment guidance and support

-   Client-Side Only (No Cloud Storage):

    -   Use ERMITS tools with local browser storage only

    -   CDI never leaves your device

    -   Disable cloud synchronization features

    -   Highest assurance for CDI protection (recommended for most
        contractors)

### 2.4.2 Data Location and Sovereignty

**ERMITS Infrastructure Locations:**

-   Primary Infrastructure: United States (Supabase US region, Vercel US
    region)

-   Optional EU Residency: Available for Enterprise customers (Supabase
    EU region)

-   CDN: Global Vercel CDN for content delivery (no CDI cached)

**CDI/FCI Data Location:** Due to Privacy-First Architecture:

-   CDI processed entirely client-side (your device)

-   If cloud sync enabled with encryption: Encrypted CDI stored in
    Supabase (US or EU region per your selection)

-   ERMITS cannot access encrypted CDI (zero-knowledge architecture)

-   Backups remain within selected region

**Compliance with Data Location Requirements:** If your contract
requires CDI to remain within U.S. boundaries:

-   Use ERMITS U.S. infrastructure (default)

-   Or use client-side only mode (no cloud storage)

-   Or deploy on-premises or to your FedRAMP-authorized U.S. cloud

# 3. CYBERSECURITY MATURITY MODEL CERTIFICATION (CMMC) REQUIREMENTS

## 3.1 CMMC Program Overview

The Cybersecurity Maturity Model Certification (CMMC) program is DoD\'s
framework for assessing and enhancing cybersecurity posture of defense
contractors. CMMC requirements are progressively being incorporated into
DoD contracts.

### 3.1.1 CMMC Levels and Requirements

**CMMC Level 1 (Foundational):**

-   Scope: Contractors processing FCI (not CUI)

-   Requirements: 17 practices corresponding to FAR 52.204-21 basic
    safeguarding requirements

-   Assessment: Annual self-assessment (attestation by senior company
    official)

-   Certificate: Company self-affirms compliance, no third-party
    assessment required

**CMMC Level 2 (Advanced):**

-   Scope: Contractors processing CUI

-   Requirements: All 110 NIST SP 800-171 Rev 2 security requirements

-   Assessment: Self-assessment for most contractors; third-party
    assessment by CMMC Third-Party Assessment Organization (C3PAO) for
    high-priority programs

-   Certificate: Valid for three years; must be renewed before
    expiration

-   POA&M Allowance: Up to one year to remediate gaps (maximum -10 point
    SPRS score)

**CMMC Level 3 (Expert):**

-   Scope: Contractors processing high-value CUI or supporting critical
    national security programs

-   Requirements: NIST SP 800-171 + subset of NIST SP 800-172 enhanced
    security requirements

-   Assessment: Government-led assessment by Defense Contract Management
    Agency (DCMA) or Defense Counterintelligence and Security Agency
    (DCSA)

-   Certificate: Valid for three years; highest level of scrutiny

### 3.1.2 Determining Your Required CMMC Level

**Your Responsibility:** Your required CMMC level is specified in your
DoD contract solicitation and award documents. Review your contract for:

-   DFARS clause 252.204-7021 (Cybersecurity Maturity Model
    Certification Requirements)

-   Contract Data Requirements List (CDRL) specifying CUI handling

-   Statement of Work (SOW) or Performance Work Statement (PWS)
    indicating CDI/CUI/FCI requirements

-   DD Form 254 (DoD Contract Security Classification Specification) if
    handling classified or CUI

**General Guidance:**

-   FCI only: CMMC Level 1 (or Level 2 if contract so specifies)

-   CUI: CMMC Level 2 minimum (most common requirement)

-   High-priority programs or critical CUI: CMMC Level 3

-   Subcontractors: Must achieve same CMMC level as prime contract
    requirement (flow-down requirement)

**ERMITS Cannot Determine Your CMMC Level:** ERMITS provides tools for
CMMC preparation but does not determine your required level or assess
your compliance. Consult your Contracting Officer, legal counsel, or
CMMC consultant.

## 3.2 ERMITS Tools for CMMC Compliance

**CyberCertitude™ Product Suite:** ERMITS offers specialized tools to
assist with CMMC preparation and implementation:

### 3.2.1 CMMC Level 1 Implementation Suite

Designed for contractors requiring CMMC Level 1 certification (FCI
processing).

-   Features:

    -   17 Practice Assessment: Evaluate implementation of all CMMC
        Level 1 practices

    -   Self-Assessment Guidance: Step-by-step guidance for conducting
        annual self-assessment

    -   Senior Official Attestation Templates: Generate required
        attestation documentation

    -   Basic Safeguarding SSP: Create System Security Plan documenting
        FAR 52.204-21 compliance

    -   Gap Analysis: Identify unimplemented practices requiring
        remediation

    -   Evidence Repository: Organize documentation supporting practice
        implementation

### 3.2.2 CMMC Level 2 Compliance Platform

Comprehensive platform for CMMC Level 2 preparation (CUI processing,
NIST SP 800-171 compliance).

-   Features:

    -   110 Control Assessment: Full NIST SP 800-171 Rev 2 control
        evaluation

    -   SPRS Score Calculation: Calculate assessment scores using DoD
        methodology

    -   POA&M Management: Track remediation efforts with timelines and
        milestones

    -   SSP Generator: Create comprehensive System Security Plans with
        control narratives

    -   Assessment Preparation: Organize evidence and prepare for C3PAO
        assessment

    -   CUI Identification and Marking: Tools for proper CUI
        classification and marking

    -   Continuous Monitoring: Ongoing assessment of control
        effectiveness

    -   Certification Readiness Assessment: Evaluate preparedness for
        formal C3PAO assessment

### 3.2.3 Original Toolkit (Local Storage Legacy)

Early ERMITS product using localStorage-based compliance management
(legacy support).

-   Features:

    -   Basic NIST SP 800-171 assessment

    -   Local browser storage (no cloud sync)

    -   Simplified compliance tracking

**Note:** The Original Toolkit is being phased out in favor of the CMMC
Level 2 Compliance Platform. Existing users are encouraged to migrate to
the newer platform for enhanced features and support.

## 3.3 CMMC Assessment Process

### 3.3.1 CMMC Level 1 Self-Assessment

**Annual Requirement:** CMMC Level 1 requires annual self-assessment
affirmed by a senior company official.

-   Self-Assessment Process:

    -   Review Implementation: Evaluate implementation of all 17 CMMC
        Level 1 practices

    -   Document Evidence: Collect evidence supporting practice
        implementation (policies, screenshots, logs, etc.)

    -   Identify Gaps: Note any practices not fully implemented

    -   Remediate: Implement missing practices or develop POA&Ms

    -   Senior Official Attestation: Company senior official (CEO,
        President, COO, etc.) signs attestation affirming compliance

    -   Submit to SPRS: Upload attestation and assessment score to SPRS
        portal

**ERMITS Level 1 Suite Support:** The CMMC Level 1 Implementation Suite
guides you through each step, provides templates, and helps organize
evidence.

### 3.3.2 CMMC Level 2 Self-Assessment

Most CMMC Level 2 contracts allow self-assessment (triennial
certification required for high-priority programs only).

-   Self-Assessment Process:

    -   Complete NIST SP 800-171 Assessment: Evaluate all 110 security
        requirements

    -   Calculate SPRS Score: Use DoD scoring methodology (-3 to +110
        scale)

    -   Develop POA&Ms: For controls not fully implemented (maximum -10
        score with POA&Ms)

    -   Create/Update SSP: Document control implementation in System
        Security Plan

    -   Submit to SPRS: Upload assessment score, POA&M summary, and date
        of assessment

    -   Maintain Continuous Monitoring: Regularly reassess controls and
        update SPRS score as needed

**ERMITS Level 2 Platform Support:** The CMMC Level 2 Compliance
Platform provides comprehensive tools for all assessment steps,
including SPRS score calculation, SSP generation, and POA&M management.

### 3.3.3 CMMC Level 2 Third-Party Assessment (C3PAO)

Required for high-priority DoD programs or contracts specified by
Contracting Officer.

-   C3PAO Assessment Process:

    -   Select C3PAO: Choose CMMC Third-Party Assessment Organization
        from CMMC-AB authorized list

    -   Pre-Assessment Preparation: Complete self-assessment, develop
        SSP, gather evidence

    -   Readiness Assessment: Many C3PAOs offer pre-assessment gap
        analysis (recommended)

    -   Formal Assessment: C3PAO conducts on-site or remote assessment
        (typically 3-5 days)

    -   Findings and Remediation: Address any findings or observations
        identified by C3PAO

    -   Certification: If successful, C3PAO issues CMMC Level 2
        certificate (valid 3 years)

    -   Upload to SPRS: C3PAO uploads certificate and assessment results
        to SPRS

**ERMITS C3PAO Preparation:** The CMMC Level 2 Compliance Platform
includes C3PAO assessment preparation tools:

-   Evidence Collection and Organization: Structure evidence per C3PAO
    requirements

-   Assessment Readiness Checklist: Verify preparedness before engaging
    C3PAO

-   Mock Assessment: Self-assessment simulating C3PAO evaluation

-   Export Packages: Generate documentation packages for C3PAO (SSP,
    evidence, diagrams)

**Important:** ERMITS is NOT a C3PAO and does not conduct formal CMMC
assessments or issue CMMC certificates. ERMITS tools prepare you for
C3PAO assessment but do not replace it.

## 3.4 CMMC Flow-Down Requirements

### 3.4.1 Subcontractor CMMC Requirements

**Flow-Down Obligation:** Prime contractors must flow down CMMC
requirements to subcontractors who will process CDI, CUI, or FCI.

-   Determining Subcontractor CMMC Level:

    -   Same Level as Prime: Subcontractors typically require same CMMC
        level as prime contract

    -   Scope-Based: If subcontractor only handles FCI (not CUI), Level
        1 may be appropriate even if prime is Level 2

    -   No CDI/CUI/FCI: If subcontractor does not process any controlled
        information, CMMC may not be required

-   Subcontract Language:

    -   Include DFARS 252.204-7012 (if CUI involved)

    -   Include FAR 52.204-21 (if FCI involved)

    -   Specify required CMMC level and certification deadline

    -   Include cyber incident reporting requirements

    -   Require subcontractor to flow down to lower-tier subcontractors

### 3.4.2 Supplier and Vendor Requirements

Suppliers and vendors in the DIB supply chain may also require CMMC
certification if they process CDI, CUI, or FCI.

**ERMITS VendorSoluce™ Platform:** Supply chain risk management tools
for evaluating supplier/vendor CMMC compliance and cybersecurity
posture. Includes:

-   Supplier Assessments: Evaluate vendor CMMC readiness and NIST SP
    800-171 compliance

-   Risk Scoring: Calculate supplier risk based on cybersecurity
    maturity

-   Questionnaires: Distribute CMMC-specific questionnaires to vendors

-   Evidence Collection: Collect vendor CMMC certificates and SSPs

-   Monitoring: Continuous monitoring of vendor compliance status

## 3.5 Maintaining CMMC Compliance

CMMC compliance is not a one-time event. Contractors must maintain
continuous compliance throughout contract performance.

### 3.5.1 Continuous Monitoring and Improvement

-   Requirements:

    -   Regularly reassess control implementation (quarterly or monthly
        recommended)

    -   Update SSP when systems or controls change

    -   Track POA&M progress and close items according to milestones

    -   Update SPRS score when material changes affect assessment
        results

    -   Conduct internal audits and compliance reviews

    -   Maintain security awareness training for all users

**ERMITS Continuous Monitoring:** Both CMMC Level 1 and Level 2
platforms include continuous monitoring features:

-   Automated Reassessment Reminders: Notifications for scheduled
    reassessments

-   Control Status Tracking: Monitor implementation status of all
    practices/controls

-   Change Log: Document and track system and control changes

-   POA&M Dashboard: Visualize remediation progress and upcoming
    deadlines

-   Compliance Reports: Generate periodic compliance status reports for
    management

### 3.5.2 Recertification and Renewal

**CMMC Level 1:** Annual self-assessment and senior official attestation

**CMMC Level 2 (Self-Assessment):** Reassess and update SPRS score at
least annually or when material changes occur

**CMMC Level 2 (C3PAO):** Certificate valid for three years; must
undergo new C3PAO assessment before expiration

Plan ahead for recertification (begin preparation 6 months before
expiration). ERMITS platforms track certification expiration dates and
send reminders.

# 4. INCORPORATED FAR CLAUSES

## 4.1 FAR 52.203-13: Contractor Code of Business Ethics and Conduct

For contracts exceeding \$10 million with performance period of 120 days
or more, contractors must:

-   Maintain a written code of business ethics and conduct

-   Implement internal control system to detect and prevent violations

-   Provide ethics training to employees

-   Establish internal reporting mechanism for violations

-   Report violations to appropriate government officials

**ERMITS Commitment:** ERMITS LLC maintains a code of business ethics
and conducts business with integrity. Users are expected to comply with
all applicable ethics requirements in their contracts.

## 4.2 FAR 52.222-26: Equal Opportunity

Contractors and subcontractors shall not discriminate on the basis of
race, color, religion, sex, sexual orientation, gender identity,
national origin, disability, or status as a protected veteran.

**ERMITS Commitment:** ERMITS LLC is an equal opportunity employer.

## 4.3 FAR 52.222-50: Combating Trafficking in Persons

Contractors and subcontractors must comply with prohibitions against
trafficking in persons, including:

-   Prohibiting use of forced labor and child labor

-   Prohibiting destruction of identity documents

-   Prohibiting misleading or fraudulent recruitment practices

-   Providing return transportation for certain workers

-   Prohibiting charging recruitment fees

**ERMITS Commitment:** ERMITS LLC opposes human trafficking and forced
labor and complies with all requirements of this clause.

## 4.4 FAR 52.223-18: Encouraging Contractor Policies to Ban Text Messaging While Driving

Contractors are encouraged to adopt and enforce policies that ban text
messaging while driving company vehicles or while performing work for
the government.

**ERMITS Commitment:** ERMITS LLC promotes safe driving practices and
discourages text messaging while driving.

# 5. CONTRACTOR REPRESENTATIONS AND CERTIFICATIONS

By accepting this Addendum and using ERMITS Services for federal
contract work, you represent and certify as follows:

## 5.1 NIST SP 800-171 Compliance Representation

You represent that, for systems used to process CDI/CUI:

-   You have implemented, or have a plan to implement, NIST SP 800-171
    security requirements

-   You have documented implementation status in a System Security Plan
    (SSP)

-   You have submitted, or will submit, assessment scores to SPRS

-   You will maintain Plans of Action and Milestones (POA&Ms) for
    unimplemented controls

-   You will notify DoD of any material changes affecting compliance

## 5.2 Cyber Incident Reporting Representation

You represent that:

-   You understand your obligation to report cyber incidents affecting
    CDI/CUI to DoD within 72 hours

-   You have implemented incident detection and response capabilities

-   You will preserve forensic evidence and cooperate with DoD
    investigations

-   You understand that ERMITS\' Privacy-First Architecture limits
    ERMITS\' ability to detect incidents on your behalf

## 5.3 CUI Marking and Handling Representation

You represent that:

-   You understand your obligation to properly mark CUI per 32 CFR Part
    2002

-   You will implement appropriate safeguards for CUI processing

-   You will train personnel on CUI handling requirements

-   You will not transmit CUI over unsecured channels

-   You will properly sanitize CUI when no longer needed

## 5.4 ERMITS Configuration Representation

You represent that, when using ERMITS Services for CDI/CUI/FCI:

-   You will configure ERMITS Services appropriately (enable encryption,
    use self-managed infrastructure where required, implement MFA)

-   You will not use ERMITS cloud-managed services for CUI if your
    contract requires FedRAMP authorization

-   You understand that ERMITS tools assist with compliance but do not
    guarantee certification

-   You are responsible for determining appropriate deployment model for
    your contract requirements

## 5.5 CMMC Representation

You represent that:

-   You understand your required CMMC level based on your contract
    requirements

-   You will achieve required CMMC certification by contract deadline

-   You will flow down CMMC requirements to subcontractors as
    appropriate

-   You will maintain continuous compliance throughout contract
    performance

-   You will update SPRS with current assessment scores and
    certification status

# 6. LIMITATIONS AND DISCLAIMERS

## 6.1 No Guarantee of Compliance or Certification

**CRITICAL DISCLAIMER:** ERMITS products and services are tools to
assist with DFARS/FAR compliance and CMMC preparation. Use of ERMITS
Services:

-   Does NOT guarantee compliance with DFARS, FAR, NIST SP 800-171, or
    CMMC requirements

-   Does NOT constitute a compliance assessment, audit, or certification

-   Does NOT replace professional compliance consulting, legal counsel,
    or C3PAO assessment

-   Does NOT guarantee specific SPRS assessment scores or CMMC
    certification outcomes

-   Is NOT endorsed, certified, or sponsored by DoD, NIST, CMMC-AB, or
    any government agency

**Your Responsibility:** You are solely responsible for:

-   Understanding and complying with all contractual requirements

-   Implementing appropriate security controls and safeguards

-   Conducting formal compliance assessments and obtaining
    certifications

-   Verifying that ERMITS Services meet your specific requirements

-   Maintaining compliance throughout contract performance

## 6.2 ERMITS is Not a C3PAO or Certification Authority

ERMITS LLC is not:

-   A CMMC Third-Party Assessment Organization (C3PAO)

-   Authorized by CMMC-AB to conduct CMMC assessments or issue
    certificates

-   A DoD-endorsed or -certified compliance assessment provider

-   A NIST-endorsed assessment tool or methodology

-   A FedRAMP-authorized cloud service provider (CSP)

ERMITS provides tools for self-assessment, preparation, and compliance
management. For formal CMMC certification, you must engage an authorized
C3PAO.

## 6.3 Privacy-First Architecture Limitations

Due to ERMITS\' Privacy-First Architecture with zero-knowledge
encryption:

-   ERMITS Advantages:

    -   CDI/CUI processed client-side, never transmitted to ERMITS
        servers (highest assurance)

    -   Zero-knowledge encryption ensures ERMITS cannot access encrypted
        CDI/CUI

    -   Reduces ERMITS\' security obligations and risk exposure

-   ERMITS Limitations:

    -   ERMITS cannot verify accuracy or integrity of locally-processed
        CDI/CUI

    -   ERMITS cannot detect cyber incidents affecting your CDI/CUI
        (this is your responsibility)

    -   ERMITS cannot provide detailed forensics or incident response
        for locally-stored data

    -   ERMITS has limited ability to assist with data recovery if
        encryption keys are lost

    -   User is responsible for endpoint security, backups, and local
        data protection

**Result:** ERMITS\' Privacy-First Architecture provides strong privacy
and security protections but places greater responsibility on users for
incident detection, data integrity, and endpoint security.

## 6.4 Third-Party Data Sources

ERMITS Services rely on third-party data sources for certain features
(e.g., NIST NVD, CISA KEV, OSV.dev for vulnerability data). ERMITS:

-   Does not guarantee accuracy, completeness, or timeliness of
    third-party data

-   Is not responsible for errors or omissions in third-party data

-   Cannot control availability or updates of third-party sources

-   Recommends users verify critical information independently

# 7. U.S. GOVERNMENT RIGHTS AND SPECIAL PROVISIONS

## 7.1 U.S. Government Rights in Software

ERMITS Services are commercial computer software and commercial computer
software documentation as defined in FAR 12.212 and DFARS 227.7202.

**Government Rights:** The U.S. Government\'s rights to use, modify,
reproduce, release, perform, display, or disclose ERMITS Services are
limited to those set forth in this Addendum and the applicable Master
Terms of Service, in accordance with FAR 12.211 and FAR 12.212 (for
civilian agencies) or DFARS 227.7202-1 and DFARS 227.7202-3 (for DoD).

Government rights are restricted to \"commercial computer software\"
rights, NOT \"government purpose rights\" or \"unlimited rights.\"

## 7.2 Export Control Compliance

ERMITS Services and related technical data may be subject to U.S. export
control laws and regulations, including:

-   Export Administration Regulations (EAR, 15 CFR Parts 730-774)

-   International Traffic in Arms Regulations (ITAR, 22 CFR Parts
    120-130)

-   Office of Foreign Assets Control (OFAC) sanctions

**Your Obligations:** You agree to:

-   Comply with all applicable U.S. export control laws and regulations

-   Not export, re-export, or transfer ERMITS Services or technical data
    to prohibited destinations, entities, or persons

-   Not use ERMITS Services for prohibited end uses (e.g., weapons
    development, nuclear proliferation)

-   Obtain required export licenses before transferring controlled data

-   Screen users, subcontractors, and vendors against restricted party
    lists

**CUI Category SP-EXPT:** If you process export-controlled technical
data marked as CUI//SP-EXPT, ensure compliance with EAR/ITAR
requirements in addition to NIST SP 800-171.

## 7.3 Records Retention

Federal contractors must retain records related to contract performance
in accordance with FAR 4.7 and agency-specific requirements.

**Your Obligations:**

-   Retain contract-related records (including records generated using
    ERMITS Services) for at least three years after final payment

-   Retain records longer if required by contract, litigation hold, or
    audit

-   Make records available for government audit or review

-   Export and preserve ERMITS-generated records before canceling ERMITS
    subscription

**ERMITS Data Retention:** ERMITS retains user data per the Master
Privacy Policy (typically 30 days after account deletion for paid
accounts). Due to Privacy-First Architecture, most user data is stored
locally by you. You are responsible for backing up and preserving data
for government records retention requirements.

## 7.4 Government Audit Rights

The U.S. Government may audit contractor compliance with DFARS/FAR
requirements.

**Your Obligations:**

-   Cooperate with government audits and inspections

-   Provide access to records, systems, and facilities (subject to
    security clearances)

-   Allow government review of SSPs, POA&Ms, assessment reports, and
    compliance documentation

-   Remediate deficiencies identified during audits

**ERMITS Cooperation:** ERMITS will cooperate with government audits
related to Services provided to you, subject to protection of other
users\' privacy and security. Due to zero-knowledge encryption, ERMITS
cannot provide CDI/CUI content to auditors, but can provide architecture
documentation and audit logs (pseudonymized metadata).

# 8. TERMINATION AND REMEDIES FOR NON-COMPLIANCE

## 8.1 Government Termination Rights

Failure to comply with DFARS/FAR requirements may result in government
action, including:

-   Contract termination for default or convenience

-   Withholding of payments

-   Suspension or debarment from federal contracting

-   Civil penalties and fines

-   Criminal prosecution (for willful violations)

-   Referral to Department of Justice for False Claims Act violations

**ERMITS is Not Responsible:** ERMITS is not responsible for government
actions taken against you for non-compliance with DFARS/FAR
requirements. You indemnify ERMITS for claims arising from your
non-compliance.

## 8.2 Remediation Requirements

If deficiencies are identified in your NIST SP 800-171 or CMMC
compliance:

-   Promptly develop POA&Ms for unimplemented controls

-   Remediate deficiencies according to agreed-upon timelines (typically
    within one year maximum for CMMC Level 2)

-   Update SPRS scores to reflect remediation progress

-   Notify Contracting Officer of material changes affecting compliance
    status

-   Submit corrective action plans if required by government

**ERMITS POA&M Tools:** ERMITS CMMC platforms include POA&M management
features to help track and manage remediation efforts.

# 9. UPDATES TO THIS ADDENDUM

## 9.1 Regulatory Changes

DFARS, FAR, NIST SP 800-171, and CMMC requirements are subject to
change. ERMITS may update this Addendum to reflect:

-   New or revised DFARS/FAR clauses

-   Updates to NIST SP 800-171 (e.g., Rev 3)

-   Changes to CMMC program (e.g., CMMC 2.0 updates)

-   New DoD cyber incident reporting requirements

-   Clarifications or guidance from DoD, NIST, or CMMC-AB

## 9.2 Notification of Changes

**Material Changes:** 30 days\' advance notice via email and in-app
notification

**Non-Material Changes:** Effective immediately upon posting with
updated \"Last Updated\" date

Continued use of ERMITS Services after changes take effect constitutes
acceptance of the updated Addendum.

## 9.3 Your Responsibility to Stay Informed

You are responsible for staying informed about changes to DFARS/FAR/CMMC
requirements and ensuring your compliance. ERMITS recommends:

-   Regularly reviewing contract clauses and solicitations

-   Monitoring CMMC-AB and DoD announcements

-   Subscribing to NIST and CISA cybersecurity alerts

-   Consulting with compliance professionals, legal counsel, or CMMC
    consultants

-   Attending DoD industry days and CMMC training events

# 10. CONTACT INFORMATION AND SUPPORT

## 10.1 ERMITS Contact Information

General DFARS/FAR Inquiries:\
Email: contact@ermits.comSubject: \"DFARS/FAR Addendum Inquiry\"

CMMC Support:\
Email: contact@ermits.comSubject: \"CMMC Support Request\"

Federal Sales and Enterprise:\
Email: contact@ermits.comSubject: \"Federal Enterprise Inquiry\"

Cyber Incident Response (your responsibility to report to DoD first):\
Email: contact@ermits.comSubject: \"Cyber Incident - ERMITS Assistance\"

## 10.2 Government Resources

For questions about DFARS, FAR, or CMMC requirements, contact:

**Your Contracting Officer:** Primary point of contact for
contract-specific questions

**CMMC-AB (Cyber-AB):** https://cyberab.org - CMMC program information
and C3PAO directory

**DoD Cyber Exchange (DIBNet):** https://dibnet.dod.mil - Cyber incident
reporting portal and resources

**NIST:**
https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final - NIST
SP 800-171 resources

**SPRS Portal:** https://www.sprs.csd.disa.mil/ - Supplier Performance
Risk System for score submission

**Defense Acquisition University (DAU):** https://www.dau.edu - Training
and resources for defense contractors

# 11. ACKNOWLEDGMENT AND ACCEPTANCE

By using ERMITS Services for work related to federal contracts subject
to DFARS or FAR, you acknowledge that:

-   You have read and understand this DFARS/FAR Compliance Addendum

-   You understand your obligations under applicable DFARS and FAR
    clauses

-   You understand the limitations of ERMITS Services and your sole
    responsibility for compliance and certification

-   You will configure and use ERMITS Services appropriately for your
    CDI/CUI/FCI processing requirements

-   You will comply with all cyber incident reporting, NIST SP 800-171,
    and CMMC requirements

-   You agree to the terms and conditions set forth in this Addendum
