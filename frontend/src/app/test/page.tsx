export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'blue' }}>
      <h1>Page de Test</h1>
      <p>Si vous voyez ceci, l'application fonctionne !</p>
      <p>Heure: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}
