package providers

type JSONCall struct {
	Prompt      string
	MaxTokens   int
	Temperature float64
}

type JSONResult struct {
	Text         string
	ProviderName string
	Model        string
	InputTokens  int
	OutputTokens int
	CostUSDEst   float64
}

type Provider interface {
	Name() string
	GenerateJSON(req JSONCall) (JSONResult, error)
}
