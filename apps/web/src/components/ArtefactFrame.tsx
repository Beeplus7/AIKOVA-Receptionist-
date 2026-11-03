type ArtefactFrameProps = {
  title: string
  src: string
  className?: string
}

export default function ArtefactFrame({ title, src, className }: ArtefactFrameProps) {
  return (
    <div className={['eu-artefact', className].filter(Boolean).join(' ')}>
      <iframe title={title} src={src} className="eu-artefact__frame" />
    </div>
  )
}
