package compiler

// PlanLimits defines the resource constraints for a tenant plan
type PlanLimits struct {
	MaxTokenBudget int     // per compile hard cap
	MaxUSDPerDay   float64 // per tenant per day
	MaxCompiles    int     // per day
}

// LimitsForPlan returns the limits for a given plan tier
func LimitsForPlan(plan string) PlanLimits {
	switch plan {
	case "pro":
		return PlanLimits{
			MaxTokenBudget: 20000,
			MaxUSDPerDay:   2.0,
			MaxCompiles:    200,
		}
	case "team":
		return PlanLimits{
			MaxTokenBudget: 50000,
			MaxUSDPerDay:   10.0,
			MaxCompiles:    1000,
		}
	case "enterprise":
		return PlanLimits{
			MaxTokenBudget: 100000,
			MaxUSDPerDay:   100.0,
			MaxCompiles:    10000,
		}
	default: // free
		return PlanLimits{
			MaxTokenBudget: 2000,
			MaxUSDPerDay:   0.02, // ~$0.02/day free tier
			MaxCompiles:    5,
		}
	}
}
