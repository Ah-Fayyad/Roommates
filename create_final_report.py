#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete merge of Part 1 + Part 2 + Front Matter with proper structure
"""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import datetime

def create_final_report():
    """Create final comprehensive report with all parts"""
    
    # Load source documents
    part1_doc = Document(r"d:\Ahmed pc\Aou\TMA Today\Project TM471-A\Report\TM471-A.docx")
    part2_doc = Document(r"d:\Ahmed pc\test-roommates\Graduation_Project_Report.docx")
    
    # Create new document
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
    run = subtitle.add_run("Graduation Project Report - Part 1 & Part 2")
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(31, 78, 121)
    
    doc.add_paragraph()
    doc.add_paragraph()
    
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = info.add_run("Project Code: TM471-A")
    run.font.size = Pt(14)
    run.font.bold = True
    
    doc.add_paragraph()
    doc.add_paragraph()
    doc.add_paragraph()
    
    faculty = doc.add_paragraph()
    faculty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = faculty.add_run("Arab Open University")
    run.font.size = Pt(12)
    run.font.bold = True
    
    dept = doc.add_paragraph()
    dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = dept.add_run("Faculty of Computer Studies")
    run.font.size = Pt(11)
    
    doc.add_paragraph()
    doc.add_paragraph()
    
    date_para = doc.add_paragraph()
    date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = date_para.add_run(f"Date: {datetime.now().strftime('%B %d, %Y')}")
    run.font.size = Pt(11)
    
    # ============ TABLE OF CONTENTS ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("TABLE OF CONTENTS", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    toc_items = [
        ("CHAPTER 1: Introduction and Project Overview", 0, "1"),
        ("", -1, ""),
        ("1.1 Project Description", 1, "1-1"),
        ("1.2 Problem Statement", 1, "1-2"),
        ("1.3 Objectives", 1, "1-3"),
        ("1.4 Scope and Constraints", 1, "1-4"),
        ("", -1, ""),
        ("CHAPTER 2: Literature Review and Related Work", 0, "2"),
        ("", -1, ""),
        ("2.1 Background Research", 1, "2-1"),
        ("2.2 Related Platforms", 1, "2-2"),
        ("2.3 Technology Review", 1, "2-3"),
        ("", -1, ""),
        ("CHAPTER 3: System Requirements and Analysis", 0, "3"),
        ("", -1, ""),
        ("3.1 Functional Requirements", 1, "3-1"),
        ("3.2 Non-Functional Requirements", 1, "3-2"),
        ("3.3 Use Case Diagrams", 1, "3-3"),
        ("3.4 System Architecture Diagrams", 1, "3-4"),
        ("", -1, ""),
        ("CHAPTER 4: Design, Implementation, and Testing", 0, "4"),
        ("", -1, ""),
        ("4.1 Development Approach", 1, "4-1"),
        ("    4.1.1 Primary Approach: Agile Development", 2, "4-1"),
        ("    4.1.2 Alternative Approach: Waterfall Model", 2, "4-1"),
        ("4.2 System Architecture", 1, "4-2"),
        ("    4.2.1 Frontend Architecture", 2, "4-2"),
        ("    4.2.2 Backend Architecture", 2, "4-2"),
        ("4.3 Changes in Design", 1, "4-3"),
        ("    4.3.1 Functional Requirements Changes", 2, "4-3"),
        ("    4.3.2 Non-Functional Requirements Changes", 2, "4-3"),
        ("    4.3.3 UI/UX Changes", 2, "4-3"),
        ("4.4 Implementation Details", 1, "4-4"),
        ("    4.4.1 Main User Interfaces", 2, "4-4"),
        ("    4.4.2 Core Code Implementation", 2, "4-5"),
        ("    4.4.3 Database Design", 2, "4-6"),
        ("4.5 Problems and Challenges Encountered", 1, "4-7"),
        ("4.6 Testing and Quality Assurance", 1, "4-11"),
        ("    4.6.1 Unit Testing", 2, "4-11"),
        ("    4.6.2 Integration Testing", 2, "4-11"),
        ("    4.6.3 API Testing", 2, "4-12"),
        ("    4.6.4 Performance Testing", 2, "4-12"),
        ("    4.6.5 Security Testing", 2, "4-12"),
        ("", -1, ""),
        ("CHAPTER 5: Results and Discussion", 0, "5"),
        ("", -1, ""),
        ("5.1 Project Overview and Achievements", 1, "5-1"),
        ("5.2 Skills Acquired", 1, "5-2"),
        ("5.3 Objectives Achievement", 1, "5-3"),
        ("5.4 Lessons Learned", 1, "5-4"),
        ("5.5 Future Development and Improvements", 1, "5-5"),
        ("5.6 Conclusion", 1, "5-6"),
        ("", -1, ""),
        ("CHAPTER 6: Conclusion", 0, "6"),
        ("", -1, ""),
        ("REFERENCES", 0, "R"),
        ("", -1, ""),
        ("LIST OF TABLES", 0, "LOT"),
        ("LIST OF FIGURES", 0, "LOF"),
    ]
    
    for item, level, page in toc_items:
        if not item:
            continue
        
        if level == -1:
            continue
        
        if level == 0:
            para = doc.add_paragraph(item)
            para.paragraph_format.space_before = Pt(6)
            para.paragraph_format.space_after = Pt(3)
            for run in para.runs:
                run.font.bold = True
                run.font.size = Pt(11)
        else:
            indent = "    " * level
            para = doc.add_paragraph(f"{indent}{item}")
            para.paragraph_format.left_indent = Inches(level * 0.25)
            para.paragraph_format.space_after = Pt(2)
            for run in para.runs:
                run.font.size = Pt(10)
        
        # Add page dots
        if page and page not in ["R", "LOT", "LOF"]:
            dots = "." * (60 - len(item))
            para.add_run(f" {dots} {page}")
    
    # ============ LIST OF TABLES ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("LIST OF TABLES", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    tables_list = [
        ("4.1", "Non-Functional Requirements (NFR) Changes", "4-3"),
        ("4.2", "API Testing Test Cases and Results", "4-12"),
        ("4.3", "Database Entities Overview", "4-6"),
        ("4.4", "Testing Coverage Summary", "4-13"),
        ("5.1", "Project Objectives Achievement Status", "5-3"),
        ("5.2", "Skills Distribution by Category", "5-2"),
    ]
    
    for num, title, page in tables_list:
        para = doc.add_paragraph()
        para.paragraph_format.left_indent = Inches(0.25)
        run = para.add_run(f"Table {num}: {title}")
        run.font.size = Pt(10)
        dots = "." * max(1, 65 - len(f"Table {num}: {title}"))
        para.add_run(f" {dots} {page}")
    
    # ============ LIST OF FIGURES ============
    
    doc.add_page_break()
    toc_heading = doc.add_heading("LIST OF FIGURES", level=1)
    for run in toc_heading.runs:
        run.font.color.rgb = RGBColor(31, 78, 121)
    
    figures_list = [
        ("4.1", "System Architecture Diagram", "4-2"),
        ("4.2", "Database Schema Diagram", "4-6"),
        ("4.3", "Authentication Flow Diagram", "4-1"),
        ("4.4", "Real-time Messaging Architecture", "4-3"),
        ("4.5", "User Interface - Dashboard", "4-7"),
        ("4.6", "User Interface - Listing Details", "4-8"),
        ("4.7", "User Interface - Real-time Messaging", "4-9"),
        ("4.8", "Admin Dashboard - Management", "4-10"),
        ("4.9", "API Response Time Metrics", "4-12"),
        ("4.10", "Page Load Time Comparison", "4-13"),
        ("4.11", "Test Coverage Distribution", "4-14"),
        ("5.1", "Objectives Achievement Chart", "5-3"),
        ("5.2", "Skills Acquired Distribution", "5-4"),
        ("5.3", "Technology Stack Overview", "5-5"),
        ("5.4", "Project Timeline Gantt Chart", "5-6"),
    ]
    
    for num, title, page in figures_list:
        para = doc.add_paragraph()
        para.paragraph_format.left_indent = Inches(0.25)
        run = para.add_run(f"Figure {num}: {title}")
        run.font.size = Pt(10)
        dots = "." * max(1, 65 - len(f"Figure {num}: {title}"))
        para.add_run(f" {dots} {page}")
    
    # ============ PART 1 CONTENT ============
    
    doc.add_page_break()
    
    # Copy all content from Part 1
    for element in part1_doc._element.body:
        doc._element.body.append(element)
    
    # ============ PART 2 CONTENT ============
    
    doc.add_page_break()
    
    # Copy all content from Part 2 (skip first page)
    skip_pages = True
    for i, element in enumerate(part2_doc._element.body):
        # Skip the first 10 elements (title and intro)
        if i < 10:
            continue
        doc._element.body.append(element)
    
    # Save final document
    output_path = r"d:\Ahmed pc\Aou\TMA Today\Project TM471-A\Report\TM471-A_Complete_Final.docx"
    doc.save(output_path)
    print(f"✅ Complete Report Generated Successfully!")
    print(f"")
    print(f"📍 Output File: TM471-A_Complete_Final.docx")
    print(f"📁 Location: d:\\Ahmed pc\\Aou\\TMA Today\\Project TM471-A\\Report\\")
    print(f"")
    print(f"📊 Report Statistics:")
    print(f"   ✓ Paragraphs: {len(doc.paragraphs)}")
    print(f"   ✓ Tables: {len(doc.tables)}")
    print(f"   ✓ Sections: 6 (Intro, Lit Review, Requirements, Design/Implementation/Testing, Results, Conclusion)")
    print(f"   ✓ Front Matter: Title Page + TOC + List of Tables + List of Figures")
    print(f"")
    print(f"📝 Contents:")
    print(f"   • CHAPTER 1: Introduction and Project Overview (Part 1)")
    print(f"   • CHAPTER 2: Literature Review and Related Work (Part 1)")
    print(f"   • CHAPTER 3: System Requirements and Analysis (Part 1)")
    print(f"   • CHAPTER 4: Design, Implementation, and Testing (Part 2)")
    print(f"     - 4.1 Development Approach")
    print(f"     - 4.2 System Architecture")
    print(f"     - 4.3 Changes in Design")
    print(f"     - 4.4 Implementation Details")
    print(f"     - 4.5 Problems and Challenges")
    print(f"     - 4.6 Testing and QA")
    print(f"   • CHAPTER 5: Results and Discussion (Part 2)")
    print(f"   • CHAPTER 6: Conclusion (Part 2)")
    print(f"   • REFERENCES")
    print(f"")
    print(f"✨ Report is ready for university submission!")

if __name__ == "__main__":
    create_final_report()
