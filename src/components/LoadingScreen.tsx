type LoadingScreenProps = {
  url: string;
  steps: string[];
  stepIndex: number;
};

export function LoadingScreen({ url, steps, stepIndex }: LoadingScreenProps) {
  const progress = Math.round((stepIndex / (steps.length - 1)) * 100);

  return (
    <section className="analysis screen">
      <div className="analysis__inner">
        <h2 className="analysis__title">Анализируем сайт</h2>
        <p className="analysis__subtitle">Проверяем, где страница может терять заявки</p>
        <div className="url-pill">{url}</div>
        <div className="analysis-card">
          <div className="progress">
            <div className="progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <ul className="analysis-steps">
            {steps.map((step, index) => (
              <li key={step} className={index < stepIndex ? "is-done" : index === stepIndex ? "is-current" : ""}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
