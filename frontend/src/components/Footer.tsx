import * as React from "react"

const GITHUB_URL = "https://github.com/math-hiyoko/sudoku-solver"

const styles: Record<string, React.CSSProperties> = {
  footer: {
    textAlign: 'center',
    padding: '20px',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
  link: {
    color: '#666',
    textDecoration: 'none',
  },
}

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        Source: github.com/math-hiyoko/sudoku-solver
      </a>
    </footer>
  )
}

export default Footer
