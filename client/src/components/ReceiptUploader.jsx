import { useRef, useState } from 'react';

// レシート画像のアップロード（クリック選択 or ドラッグ＆ドロップ）を担うコンポーネント
export default function ReceiptUploader({ onUpload, isLoading }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  // ファイルを受け取り、プレビュー表示と親コンポーネントへの通知を行う
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="uploader-card">
      <h2>レシートをアップロード</h2>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Claude AIがレシートを解析中...</p>
          </div>
        ) : preview ? (
          <div className="preview-state">
            <img src={preview} alt="レシートプレビュー" className="receipt-preview" />
            <p className="preview-hint">クリックして別の画像を選択</p>
          </div>
        ) : (
          <div className="empty-drop">
            <div className="drop-icon">📷</div>
            <p>クリックまたはドラッグ＆ドロップで</p>
            <p>レシート画像をアップロード</p>
            <span className="file-hint">JPEG・PNG・WebP 対応</span>
          </div>
        )}
      </div>

      {/* input はクリックで開くため非表示 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden-input"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
