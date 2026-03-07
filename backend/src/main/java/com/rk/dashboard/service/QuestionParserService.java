package com.rk.dashboard.service;

import com.rk.dashboard.model.QuestionRow;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Parses question papers from Excel (.xlsx) or PDF.
 *
 * Excel columns (row 1 = header, data from row 2):
 *   Section | Question | Option A | Option B | Option C | Option D | Correct (A-D) | Difficulty
 *
 * PDF format per question block:
 *   1. Question text
 *   A) option
 *   B) option  C) option  D) option
 *   Answer: A
 *   (Optional) # Section Name resets the current section.
 */
@Service
public class QuestionParserService {

    public List<QuestionRow> parseExcel(MultipartFile file, int assessmentId) throws IOException {
        List<QuestionRow> rows = new ArrayList<>();
        try (Workbook wb = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                String section = str(row, 0);
                String text    = str(row, 1);
                String optA    = str(row, 2);
                String optB    = str(row, 3);
                String optC    = str(row, 4);
                String optD    = str(row, 5);
                String answer  = str(row, 6).toUpperCase().trim();
                String diff    = str(row, 7);
                if (text.isBlank()) continue;
                if (!answer.matches("[ABCD]")) answer = "A";
                rows.add(new QuestionRow(assessmentId,
                        section.isBlank() ? "General" : section,
                        text, optA, optB, optC, optD, answer,
                        diff.isBlank() ? "Medium" : diff));
            }
        }
        return rows;
    }

    public List<QuestionRow> parsePdf(MultipartFile file, int assessmentId) throws IOException {
        List<QuestionRow> rows = new ArrayList<>();
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String[] lines = stripper.getText(doc).split("\\r?\\n");
            String section = "General", qText = null;
            String optA = null, optB = null, optC = null, optD = null;

            for (String raw : lines) {
                String line = raw.trim();
                if (line.isBlank()) continue;
                if (line.startsWith("#") || line.toLowerCase().startsWith("section:")) {
                    section = line.replaceAll("(?i)^#+|^[Ss]ection:\\s*", "").trim();
                    continue;
                }
                if (line.toLowerCase().startsWith("answer:")) {
                    String ans = line.replaceAll("(?i)^answer:\\s*", "").trim().toUpperCase();
                    if (qText != null && optA != null && ans.matches("[ABCD]")) {
                        rows.add(new QuestionRow(assessmentId, section, qText,
                                nvl(optA), nvl(optB), nvl(optC), nvl(optD), ans, "Medium"));
                    }
                    qText = null; optA = null; optB = null; optC = null; optD = null;
                    continue;
                }
                if (line.matches("^[Aa][).].*")) { optA = line.replaceFirst("^[Aa][).] ?", ""); continue; }
                if (line.matches("^[Bb][).].*")) { optB = line.replaceFirst("^[Bb][).] ?", ""); continue; }
                if (line.matches("^[Cc][).].*")) { optC = line.replaceFirst("^[Cc][).] ?", ""); continue; }
                if (line.matches("^[Dd][).].*")) { optD = line.replaceFirst("^[Dd][).] ?", ""); continue; }
                if (line.matches("^\\d+[.)].+")) {
                    qText = line.replaceFirst("^\\d+[.)] ?", "");
                }
            }
        }
        return rows;
    }

    private String str(Row row, int idx) {
        Cell cell = row.getCell(idx, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default      -> "";
        };
    }

    private String nvl(String s) { return s == null ? "" : s; }
}
