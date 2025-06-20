import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [response, setResponse] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch('https://data-assistant-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) setUploadStatus('Файл успешно загружен');
      else setUploadStatus('Ошибка загрузки');
    } catch (error) {
      setUploadStatus('Ошибка загрузки');
    }
    setIsUploading(false);
  };

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleQuerySubmit = async () => {
    setIsQuerying(true);
    try {
      const res = await fetch('https://data-assistant-backend.onrender.com/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.themes);
    } catch (error) {
      setResponse('Произошла ошибка');
    }
    setIsQuerying(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Data Assistant</h1>
      <p className="mb-4 text-center">Загрузите Excel-файл с фразами и темами, затем введите запрос для получения тем.</p>
      
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2">Загрузите Excel-файл:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-2 w-full" />
        {selectedFile && <span className="text-sm">{selectedFile.name}</span>}
        <button onClick={handleUpload} disabled={isUploading || !selectedFile} className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </button>
        <p className="mt-2 text-sm">{uploadStatus}</p>
      </div>
      
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2">Введите ваш запрос:</label>
        <input type="text" value={query} onChange={handleQueryChange} className="w-full p-2 border rounded" />
        <button onClick={handleQuerySubmit} disabled={isQuerying} className="w-full bg-green-500 text-white p-2 rounded mt-2 disabled:bg-gray-400">
          {isQuerying ? 'Обработка...' : 'Отправить'}
        </button>
      </div>
      
      <div>
        {response && <p className="text-lg">Ответ: {response}</p>}
      </div>
    </div>
  );
}

export default App;