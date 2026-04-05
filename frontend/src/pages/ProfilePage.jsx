const SETTINGS = [
  { section: 'アカウント設定', items: ['個人情報', 'パスワードとセキュリティ', '通知設定'] },
  { section: 'アプリ設定',     items: ['表示設定', 'データのエクスポート', 'ヘルプ'] },
]

export default function ProfilePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">プロフィール</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">📖</div>
        <div className="profile-name">学習者</div>
        <div className="profile-email">learning-log アプリ</div>
        <button className="btn-green">プロフィールを編集</button>
      </div>

      {SETTINGS.map(group => (
        <div key={group.section} className="settings-group">
          <h2 className="settings-title">{group.section}</h2>
          {group.items.map(item => (
            <button key={item} className="settings-item">
              <span>{item}</span>
              <span className="settings-arrow">›</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
