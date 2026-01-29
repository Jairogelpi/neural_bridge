package providers

import "errors"

type Mode string
const (
	ModeCheapFirst   Mode = "cheap_first"
	ModeHighAccuracy Mode = "high_accuracy"
	ModeAuto         Mode = "auto"
)

type Router struct {
	OpenAI    Provider
	Anthropic Provider
	Google    Provider
}

func (r Router) PickOrder(mode Mode) ([]Provider, error) {
	list := []Provider{}
	if r.Google != nil { list = append(list, r.Google) }
	if r.OpenAI != nil { list = append(list, r.OpenAI) }
	if r.Anthropic != nil { list = append(list, r.Anthropic) }

	if len(list) == 0 {
		return nil, errors.New("no providers configured")
	}

	switch mode {
	case ModeCheapFirst:
		return list, nil
	case ModeHighAccuracy:
		hi := []Provider{}
		if r.Anthropic != nil { hi = append(hi, r.Anthropic) }
		if r.OpenAI != nil { hi = append(hi, r.OpenAI) }
		if r.Google != nil { hi = append(hi, r.Google) }
		return hi, nil
	case ModeAuto:
		return list, nil
	default:
		return list, nil
	}
}
