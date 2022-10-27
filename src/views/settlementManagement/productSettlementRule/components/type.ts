export interface FormState {
	costName?: string | null;
	costExplanation?: string | null;
	splitList: Array<splitListType>;
	teamTypeId?: number | null;
	ruleStatus?: number | null;
	productId?: number | null;
	prepaidCompany?: number | null | string;
	chargeProductSonId?: number | null;
	chargeCount?: number | null;
	isPrepaid?: number | null;
	lastCostBelongCompany?: number | null | string;
	chargeModel?: number | null;
	level?: number | null;
	productSonType?: string | null;
	productType?: number | null;
	oid?: number | null;
	charCount?: number | string | null;
	hotelRatedId?: number | string | null;
}
export interface splitListType {
	companyType?: number | null | string;
	splitModel?: number | null;
	splitCount?: number | null;
	level?: number | null;
}
