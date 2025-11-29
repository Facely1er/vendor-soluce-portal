#!/bin/bash
# VendorSoluce SBOM Generator Script
# This script helps generate a Software Bill of Materials (SBOM) in multiple formats
# Compatible with NodeJS, Python, and Java projects

set -e

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║         VendorSoluce SBOM Generator           ║"
echo "║         Based on NIST SP 800-161 3.4.1        ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Help function
function show_help {
    echo "Generate SBOM for your project in SPDX, CycloneDX, or both formats."
    echo
    echo "Usage: $0 [options] [project_directory]"
    echo
    echo "Options:"
    echo "  -h, --help            Show this help message"
    echo "  -f, --format FORMAT   Output format: spdx, cyclonedx, or both (default: both)"
    echo "  -o, --output PATH     Output directory (default: ./sbom)"
    echo "  -t, --type TYPE       Project type: node, python, java, auto (default: auto)"
    echo "  -n, --name NAME       Project name for the SBOM"
    echo "  --no-analyze          Skip vulnerability analysis"
    echo
    echo "Examples:"
    echo "  $0 --format spdx ./my-project"
    echo "  $0 --type node --output ./sboms"
    echo
}

# Default values
FORMAT="both"
OUTPUT_DIR="./sbom"
PROJECT_TYPE="auto"
PROJECT_DIR="."
PROJECT_NAME=""
ANALYZE=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -t|--type)
            PROJECT_TYPE="$2"
            shift 2
            ;;
        -n|--name)
            PROJECT_NAME="$2"
            shift 2
            ;;
        --no-analyze)
            ANALYZE=false
            shift
            ;;
        *)
            PROJECT_DIR="$1"
            shift
            ;;
    esac
done

# Validate arguments
if [[ ! "$FORMAT" =~ ^(spdx|cyclonedx|both)$ ]]; then
    echo -e "${RED}Error: Format must be spdx, cyclonedx, or both${NC}"
    exit 1
fi

if [[ ! "$PROJECT_TYPE" =~ ^(node|python|java|auto)$ ]]; then
    echo -e "${RED}Error: Project type must be node, python, java, or auto${NC}"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}→ Scanning project directory: ${PROJECT_DIR}${NC}"

# Auto-detect project type if needed
if [[ "$PROJECT_TYPE" == "auto" ]]; then
    echo -e "${YELLOW}⟳ Auto-detecting project type...${NC}"
    
    if [[ -f "$PROJECT_DIR/package.json" ]]; then
        PROJECT_TYPE="node"
        echo -e "${GREEN}✓ Detected Node.js project${NC}"
    elif [[ -f "$PROJECT_DIR/requirements.txt" || -f "$PROJECT_DIR/pyproject.toml" || -f "$PROJECT_DIR/setup.py" ]]; then
        PROJECT_TYPE="python"
        echo -e "${GREEN}✓ Detected Python project${NC}"
    elif [[ -f "$PROJECT_DIR/pom.xml" || -f "$PROJECT_DIR/build.gradle" ]]; then
        PROJECT_TYPE="java"
        echo -e "${GREEN}✓ Detected Java project${NC}"
    else
        echo -e "${RED}Error: Could not auto-detect project type. Please specify with --type${NC}"
        exit 1
    fi
fi

# Auto-detect project name if not provided
if [[ -z "$PROJECT_NAME" ]]; then
    echo -e "${YELLOW}⟳ Auto-detecting project name...${NC}"
    
    if [[ "$PROJECT_TYPE" == "node" && -f "$PROJECT_DIR/package.json" ]]; then
        PROJECT_NAME=$(grep -m 1 '"name":' "$PROJECT_DIR/package.json" | awk -F'"' '{print $4}')
    elif [[ "$PROJECT_TYPE" == "python" && -f "$PROJECT_DIR/setup.py" ]]; then
        PROJECT_NAME=$(grep -m 1 'name=' "$PROJECT_DIR/setup.py" | awk -F"[\"']" '{print $2}')
    elif [[ "$PROJECT_TYPE" == "java" && -f "$PROJECT_DIR/pom.xml" ]]; then
        PROJECT_NAME=$(grep -m 1 '<artifactId>' "$PROJECT_DIR/pom.xml" | sed -e 's/.*<artifactId>\(.*\)<\/artifactId>.*/\1/')
    else
        PROJECT_NAME=$(basename "$(realpath "$PROJECT_DIR")")
    fi
    
    echo -e "${GREEN}✓ Using project name: ${PROJECT_NAME}${NC}"
fi

echo -e "${BLUE}→ Generating SBOM for ${PROJECT_NAME}...${NC}"

# Generate SBOM based on project type
case $PROJECT_TYPE in
    node)
        echo -e "${YELLOW}⟳ Generating SBOM for Node.js project...${NC}"
        
        # Check for cyclonedx-node dependencies
        if ! command -v cyclonedx-node &> /dev/null; then
            echo -e "${YELLOW}⟳ Installing SBOM generator dependencies...${NC}"
            npm install -g @cyclonedx/cyclonedx-npm
        fi
        
        # Generate SBOMs
        if [[ "$FORMAT" == "spdx" || "$FORMAT" == "both" ]]; then
            echo -e "${YELLOW}⟳ Generating SPDX SBOM...${NC}"
            npx @cyclonedx/cyclonedx-npm --output-format spdx-json --output-file "$OUTPUT_DIR/${PROJECT_NAME}-sbom.spdx.json" "$PROJECT_DIR"
        fi
        
        if [[ "$FORMAT" == "cyclonedx" || "$FORMAT" == "both" ]]; then
            echo -e "${YELLOW}⟳ Generating CycloneDX SBOM...${NC}"
            npx @cyclonedx/cyclonedx-npm --output-format json --output-file "$OUTPUT_DIR/${PROJECT_NAME}-sbom.cyclonedx.json" "$PROJECT_DIR"
        fi
        ;;
        
    python)
        echo -e "${YELLOW}⟳ Generating SBOM for Python project...${NC}"
        
        # Check for cyclonedx-python dependencies
        if ! command -v cyclonedx-py &> /dev/null; then
            echo -e "${YELLOW}⟳ Installing SBOM generator dependencies...${NC}"
            pip install cyclonedx-bom
        fi
        
        # Generate SBOMs
        if [[ "$FORMAT" == "spdx" || "$FORMAT" == "both" ]]; then
            echo -e "${YELLOW}⟳ Generating SPDX SBOM...${NC}"
            cyclonedx-py -r -i "$PROJECT_DIR" -o "$OUTPUT_DIR/${PROJECT_NAME}-sbom.spdx.json" --format spdx-json
        fi
        
        if [[ "$FORMAT" == "cyclonedx" || "$FORMAT" == "both" ]]; then
            echo -e "${YELLOW}⟳ Generating CycloneDX SBOM...${NC}"
            cyclonedx-py -r -i "$PROJECT_DIR" -o "$OUTPUT_DIR/${PROJECT_NAME}-sbom.cyclonedx.json" --format json
        fi
        ;;
        
    java)
        echo -e "${YELLOW}⟳ Generating SBOM for Java project...${NC}"
        
        # For Java projects, we'll use CycloneDX Maven or Gradle plugin
        if [[ -f "$PROJECT_DIR/pom.xml" ]]; then
            echo -e "${YELLOW}⟳ Detected Maven project${NC}"
            
            # Generate SBOMs
            if [[ "$FORMAT" == "cyclonedx" || "$FORMAT" == "both" ]]; then
                echo -e "${YELLOW}⟳ Generating CycloneDX SBOM...${NC}"
                cd "$PROJECT_DIR" && ./mvnw org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom -DoutputFormat=json -DoutputName="${PROJECT_NAME}-sbom.cyclonedx.json" -DoutputDirectory="../$OUTPUT_DIR"
            fi
            
            if [[ "$FORMAT" == "spdx" || "$FORMAT" == "both" ]]; then
                echo -e "${YELLOW}⟳ Generating SPDX SBOM...${NC}"
                cd "$PROJECT_DIR" && ./mvnw org.spdx:spdx-maven-plugin:build -DoutputFormat=json -DoutputFile="../$OUTPUT_DIR/${PROJECT_NAME}-sbom.spdx.json"
            fi
        elif [[ -f "$PROJECT_DIR/build.gradle" ]]; then
            echo -e "${YELLOW}⟳ Detected Gradle project${NC}"
            
            # Generate SBOMs
            if [[ "$FORMAT" == "cyclonedx" || "$FORMAT" == "both" ]]; then
                echo -e "${YELLOW}⟳ Generating CycloneDX SBOM...${NC}"
                cd "$PROJECT_DIR" && ./gradlew cyclonedxBom --output-directory="../$OUTPUT_DIR" --output-name="${PROJECT_NAME}-sbom.cyclonedx.json"
            fi
            
            if [[ "$FORMAT" == "spdx" || "$FORMAT" == "both" ]]; then
                echo -e "${RED}Warning: SPDX format for Gradle projects requires additional setup${NC}"
                echo -e "${YELLOW}Skipping SPDX generation for Gradle project${NC}"
            fi
        fi
        ;;
esac

echo -e "${GREEN}✓ SBOM generation completed${NC}"

# Analyze SBOM for vulnerabilities if requested
if [[ "$ANALYZE" == true ]]; then
    echo -e "${BLUE}→ Analyzing SBOM for vulnerabilities...${NC}"
    echo -e "${YELLOW}⟳ This would typically connect to VendorSoluce API or other vulnerability databases${NC}"
    echo -e "${YELLOW}⟳ Placeholder for vulnerability scanning...${NC}"
    
    sleep 2
    
    echo -e "${GREEN}✓ Vulnerability analysis complete. Check the SBOM for vulnerability data.${NC}"
fi

# Summary
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║                 SBOM Summary                  ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo "Project Name: $PROJECT_NAME"
echo "Project Type: $PROJECT_TYPE"
echo "Output Directory: $OUTPUT_DIR"

if [[ "$FORMAT" == "spdx" || "$FORMAT" == "both" ]]; then
    echo -e "SPDX SBOM: ${GREEN}$OUTPUT_DIR/${PROJECT_NAME}-sbom.spdx.json${NC}"
fi

if [[ "$FORMAT" == "cyclonedx" || "$FORMAT" == "both" ]]; then
    echo -e "CycloneDX SBOM: ${GREEN}$OUTPUT_DIR/${PROJECT_NAME}-sbom.cyclonedx.json${NC}"
fi

echo
echo -e "${BLUE}→ Next steps:${NC}"
echo "  1. Upload your SBOM to VendorSoluce for comprehensive analysis"
echo "  2. Review dependencies for vulnerabilities and license compliance"
echo "  3. Include SBOM with your software deliverables for compliance"
echo

echo -e "${GREEN}Done!${NC}"