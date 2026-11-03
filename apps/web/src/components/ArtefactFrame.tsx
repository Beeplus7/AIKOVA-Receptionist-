type ArtefactFrameProps = {
  title: string
  src: string
}

export default function ArtefactFrame({ title, src }: ArtefactFrameProps) {
  return (
    <div className="eu-artefact">
      <iframe title={title} src={src} className="eu-artefact__frame" />
    </div>
  )
}
