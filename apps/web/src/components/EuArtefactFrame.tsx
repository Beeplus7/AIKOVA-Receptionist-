type EuArtefactFrameProps = {
  title: string
  src: string
}

export default function EuArtefactFrame({ title, src }: EuArtefactFrameProps) {
  return (
    <div className="eu-artefact">
      <iframe title={title} src={src} className="eu-artefact__frame" />
    </div>
  )
}
