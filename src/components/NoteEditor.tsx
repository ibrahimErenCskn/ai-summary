'use client';

import { useState, useEffect } from 'react';
import { Note, SummaryLength, DetailLevel } from '@/types';
import { generateSummary, generateTitleSuggestion } from '@/lib/gemini';
import { saveNote } from '@/lib/storage';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Note) => void;
}

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [summary, setSummary] = useState(note?.summary || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
  const [isEditing, setIsEditing] = useState(!note); // Yeni not oluşturuluyorsa düzenleme modunda başla

  // Update state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary);
      setIsEditing(false); // Var olan not seçildiğinde düzenleme modunu kapat
    } else {
      setTitle('');
      setContent('');
      setSummary('');
      setIsEditing(true); // Yeni not oluşturuluyorsa düzenleme modunda başla
    }
  }, [note]);

  // Generate a summary when the content changes
  const handleGenerateSummary = async () => {
    if (!content.trim()) return;
    
    setIsGeneratingSummary(true);
    try {
      const generatedSummary = await generateSummary(content, summaryLength, detailLevel);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Generate a title suggestion based on the content
  const handleGenerateTitle = async () => {
    if (!content.trim()) return;
    
    setIsGeneratingTitle(true);
    try {
      const suggestedTitle = await generateTitleSuggestion(content);
      setTitle(suggestedTitle);
    } catch (error) {
      console.error('Error generating title:', error);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  // Save the note
  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    const updatedNote: Note = {
      id: note?.id || crypto.randomUUID(),
      title,
      content,
      summary,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveNote(updatedNote);
    onSave(updatedNote);
    setIsEditing(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Render view mode (read-only)
  if (!isEditing && note) {
    return (
      <div className="space-y-6 text-black">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Son güncelleme: {new Date(note.updatedAt).toLocaleDateString('tr-TR')}
          </div>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Düzenle
          </button>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">İçerik</h3>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {content}
          </div>
        </div>
        
        {summary && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Özet</h3>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render edit mode
  return (
    <div className="space-y-4 text-black">
      {note && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Düzenleme modu
          </div>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            İptal
          </button>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Not Başlığı"
          className="w-full px-4 py-2 text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={handleGenerateTitle}
          disabled={!content.trim() || isGeneratingTitle}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
        >
          {isGeneratingTitle ? 'Oluşturuluyor...' : 'Başlık Öner'}
        </button>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Not içeriğinizi buraya yazın..."
        className="w-full h-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="summaryLength" className="text-sm font-medium text-black">Özet Uzunluğu:</label>
          <select
            id="summaryLength"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value as SummaryLength)}
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="short">Kısa</option>
            <option value="medium">Orta</option>
            <option value="long">Uzun</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="detailLevel" className="text-sm font-medium text-black">Detay Seviyesi:</label>
          <select
            id="detailLevel"
            value={detailLevel}
            onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </div>
        
        <button
          onClick={handleGenerateSummary}
          disabled={!content.trim() || isGeneratingSummary}
          className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300"
        >
          {isGeneratingSummary ? 'Oluşturuluyor...' : 'Özet Oluştur'}
        </button>
      </div>
      
      <div className="p-4 border rounded-md bg-gray-50">
        <h3 className="mb-2 text-lg font-semibold text-black">Özet</h3>
        <div className="p-3 bg-white border rounded-md min-h-24">
          {summary ? (
            <p className="whitespace-pre-wrap text-black">{summary}</p>
          ) : (
            <p className="text-gray-400">Özet burada görünecek</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim()}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
        >
          Notu Kaydet
        </button>
      </div>
    </div>
  );
} 