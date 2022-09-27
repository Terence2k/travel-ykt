export interface FormState {
	costName?: string | null;
	costExplanation?: string | null;
	splitList: Array<splitListType>;
	teamTypeId?: number | null;
	ruleStatus?: number | null;
	productId?: number | null;
	prepaidCompany?: number | null;
	chargeProductSonId?: number | null;
	chargeCount?: number | null;
	isPrepaid?: number | null;
	lastCostBelongCompany?: number | null;
	chargeModel?: number | null;
	level?: number | null;
}
export interface splitListType {
	companyType?: number | null;
	splitModel?: number | null;
	splitCount?: number | null;
	level?: number | null;
}
