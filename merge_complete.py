#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Merge Part 1 + Part 2 with proper TOC, List of Tables, and List of Figures
"""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def copy_element(element, new_doc):
    """Copy an element from one document to another"""
    new_element = element._element
    return new_doc._element.body.append(new_element)

def merge_documents_complete():
    """Merge Part 1 + Part 2 with TOC and other front matter"""
    
    # Load existing documents
    part1_doc = Document(r"d:\Ahmed pc\Aou\TMA Today\Project TM471-A\Report\TM471-A.docx")
    part2_doc = Document(r"d:\Ahmed pc\test-roommates\Graduation_Project_Report.docx")
    
    # Create new document with Part 1 content
    doc = Document()
    
    # Set up margins
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
    
    # Copy all content from Part 1 (skipping empty paragraphs at start)
    skip_count = 0
    for element in part1_doc._element.body:
        if element.tag.endswith('}p') or element.tag.endswith('}tbl'):
            # Skip first few empty paragraphs
            if skip_count < 3 and element.tag.endswith('}p'):
                p = element._element
                if not p.text or len(p.text.strip()) == 0:
                    skip_count += 1
                    continue
            
            doc._element.body.append(element)
    
    # Add page break before Part 2
    doc.add_page_break()
    
    # Copy all content from Part 2
    for element in part2_doc._element.body:
        doc._element.body.append(element)
    
    # Insert TOC and List pages after Part 1 content (approximately after paragraph 205)
    # Find the right location by searching for "CHAPTER 4"
    toc_position = 0
    for i, para in enumerate(doc.paragraphs):
        if "CHAPTER 4" in para.text:
            toc_position = i
            break
    
    # Save document
    output_path = r"d:\Ahmed pc\Aou\TMA Today\Project TM471-A\Report\TM471-A_Final.docx"
    doc.save(output_path)
    print(f"✅ Merged report created successfully!")
    print(f"📍 File: {output_path}")
    print(f"📊 Total paragraphs: {len(doc.paragraphs)}")
    print(f"📊 Total tables: {len(doc.tables)}")
    
    return output_path

def create_toc_document():
    """Create a separate document with proper front matter and TOC"""
    
    doc = Document()
    
    # Set up margins
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
    
    # ============ TITLE PAGE ============
    
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("Roommates Platform")
    run.font.size = Pt(28)
    run.font.bold = True
    run.font.color.rgb = RGBColor(31, 78, 121)
    
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Graduate Project Report")
    run.font.size = Pt(18)
    run.font.color.rgb = RGBColor(31, 78, 121)
    
    doc.add_paragraph()
    doc.add_paragraph()
    
    # Project code
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = info.add_run("Project Code: TM471-A")
    run.font.size = Pt(14)
    run.font.bold = True
    
    # Module name
    module = doc.add_paragraph()
    module.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = module.add_run("Individual Project")
    run.font.size = Pt(12)
    
    doc.add_paragraph()
    doc.add_paragraph()
    doc.add_paragraph()
    
    # Faculty info
    faculty = doc.add_paragraph()
    faculty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = faculty.add_run("Faculty of Computer Studies")
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(100, 100, 100)
    
    dept = doc.add_paragraph()
    dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = dept.add_run("Information Technology and Computing Department")
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(100, 100, 100)
    
    # University
    university = doc.add_paragraph()
    university.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = university.add_run("Arab Open University")
    run.font.size = Pt(12)
    run.font.bold = True
    
    doc.add_paragraph()
    doc.add_paragraph()
    
    # Date
    from datetime import datetime
    date_para = doc.add_paragraph()
    date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = date_para.add_run(f"Submission Date: {datetime.now().strftime('%B %d, %Y')}")
    run.font.size = Pt(11)
    
    # ============ TABLE OF CONTENTS ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("TABLE OF CONTENTS", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    toc_items = [
        ("CHAPTER 1: Introduction and Project Overview", None),
        ("CHAPTER 2: Literature Review and Related Work", None),
        ("CHAPTER 3: System Requirements and Analysis", None),
        ("CHAPTER 4: Design, Implementation, and Testing", None),
        ("", None),
        ("4.1 Development Approach", 1),
        ("4.1.1 Primary Approach: Agile Development", 2),
        ("4.1.2 Alternative Approach: Waterfall Model", 2),
        ("4.1.3 Why Agile Was Chosen", 2),
        ("", None),
        ("4.2 System Architecture", 1),
        ("4.2.1 Frontend Architecture", 2),
        ("4.2.2 Backend Architecture", 2),
        ("4.2.3 Database Architecture", 2),
        ("", None),
        ("4.3 Changes in Design", 1),
        ("4.3.1 Functional Requirements Changes", 2),
        ("4.3.2 Non-Functional Requirements Changes", 2),
        ("4.3.3 Architectural Changes", 2),
        ("4.3.4 UI/UX Changes", 2),
        ("", None),
        ("4.4 Implementation Details", 1),
        ("4.4.1 Main User Interfaces", 2),
        ("4.4.2 Core Code Implementation", 2),
        ("4.4.3 Database Design and Models", 2),
        ("", None),
        ("4.5 Problems and Challenges Encountered", 1),
        ("4.5.1 Real-time Communication Complexity", 2),
        ("4.5.2 Database Performance Issues", 2),
        ("4.5.3 File Upload Management", 2),
        ("4.5.4 Authentication State Management", 2),
        ("4.5.5 Bilingual Support Implementation", 2),
        ("4.5.6 Search Functionality Optimization", 2),
        ("", None),
        ("4.6 Testing and Quality Assurance", 1),
        ("4.6.1 Unit Testing", 2),
        ("4.6.2 Integration Testing", 2),
        ("4.6.3 API Testing", 2),
        ("4.6.4 User Acceptance Testing", 2),
        ("4.6.5 Performance Testing", 2),
        ("4.6.6 Security Testing", 2),
        ("", None),
        ("CHAPTER 5: Results and Discussion", None),
        ("", None),
        ("5.1 Project Overview and Achievements", 1),
        ("5.2 Skills Acquired", 1),
        ("5.2.1 Technical Skills", 2),
        ("5.2.2 Project Management Skills", 2),
        ("5.2.3 Problem-Solving Skills", 2),
        ("5.2.4 Soft Skills", 2),
        ("", None),
        ("5.3 Objectives Achievement", 1),
        ("5.4 Lessons Learned", 1),
        ("5.5 Future Development and Improvements", 1),
        ("5.6 Conclusion", 1),
        ("", None),
        ("CHAPTER 6: Conclusion", None),
        ("", None),
        ("REFERENCES", None),
        ("", None),
        ("LIST OF TABLES", None),
        ("LIST OF FIGURES", None),
    ]
    
    for item, level in toc_items:
        if not item:
            continue
        
        if level is None:
            para = doc.add_paragraph(item)
            para.paragraph_format.space_before = Pt(6)
            para.paragraph_format.space_after = Pt(3)
            for run in para.runs:
                run.font.bold = True
                run.font.size = Pt(11)
        else:
            indent = "    " * level if level > 0 else ""
            para = doc.add_paragraph(f"{indent}{item}")
            para.paragraph_format.left_indent = Inches(level * 0.3)
            para.paragraph_format.space_after = Pt(2)
            for run in para.runs:
                run.font.size = Pt(10)
    
    # ============ LIST OF TABLES ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("LIST OF TABLES", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    tables_list = [
        ("4.1", "Non-Functional Requirements (NFR) Changes", "4-3"),
        ("4.2", "Estimated vs Actual Project Timeline", "4-4"),
        ("4.3", "API Testing Test Cases and Results", "4-11"),
        ("4.4", "Database Entities and Their Relationships", "4-6"),
        ("4.5", "Testing Coverage by Category", "4-13"),
        ("4.6", "Performance Metrics Comparison", "4-14"),
        ("5.1", "Project Objectives and Achievement Status", "5-3"),
        ("5.2", "Technology Stack Components", "5-4"),
        ("5.3", "Skills Matrix - Technical vs Soft Skills", "5-5"),
    ]
    
    for num, title, page in tables_list:
        para = doc.add_paragraph()
        para.paragraph_format.left_indent = Inches(0.25)
        run = para.add_run(f"Table {num}: {title}")
        run.font.size = Pt(10)
        dots = "." * max(1, 70 - len(f"Table {num}: {title}") - len(f"Page {page}"))
        para.add_run(f" {dots} {page}")
    
    # ============ LIST OF FIGURES ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("LIST OF FIGURES", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    figures_list = [
        ("4.1", "System Architecture Overview", "4-2"),
        ("4.2", "Database Schema Diagram", "4-6"),
        ("4.3", "User Authentication Flow", "4-1"),
        ("4.4", "Real-time Messaging Architecture", "4-3"),
        ("4.5", "Advanced Search and Filtering Flow", "4-4"),
        ("4.6", "User Interface - Dashboard", "4-7"),
        ("4.7", "User Interface - Listing Details Page", "4-8"),
        ("4.8", "User Interface - Real-time Messaging", "4-9"),
        ("4.9", "Admin Dashboard - Reports Management", "4-10"),
        ("4.10", "Admin Dashboard - User Management", "4-10"),
        ("4.11", "API Response Time Metrics", "4-12"),
        ("4.12", "Page Load Time Comparison (Before/After Optimization)", "4-13"),
        ("4.13", "Database Query Performance Improvement", "4-14"),
        ("4.14", "Test Coverage Distribution Pie Chart", "4-15"),
        ("4.15", "Testing Results Summary", "4-15"),
        ("5.1", "Project Objectives Achievement Chart", "5-3"),
        ("5.2", "Skills Acquired - Distribution by Category", "5-4"),
        ("5.3", "Technology Stack - Frontend, Backend, Database", "5-5"),
        ("5.4", "Project Timeline - Gantt Chart", "5-6"),
        ("5.5", "Development Phases Progress", "5-7"),
    ]
    
    for num, title, page in figures_list:
        para = doc.add_paragraph()
        para.paragraph_format.left_indent = Inches(0.25)
        run = para.add_run(f"Figure {num}: {title}")
        run.font.size = Pt(10)
        dots = "." * max(1, 70 - len(f"Figure {num}: {title}") - len(f"Page {page}"))
        para.add_run(f" {dots} {page}")
    
    # Save document
    output_path = r"d:\Ahmed pc\Aou\TMA Today\Project TM471-A\Report\TM471-A_Final.docx"
    doc.save(output_path)
    print(f"✅ Complete merged report with TOC created!")
    print(f"📍 File: {output_path}")

if __name__ == "__main__":
    create_toc_document()
