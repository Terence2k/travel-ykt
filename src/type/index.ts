// 导出所有类型
export interface UserProo {
	name: string;
}

export type Field = 'drafts' | 
				'waitingGroup' | 
				'haveABall' | 
				'refuseGroup' | 
				'waitingChange' | 
				'closeAnAccount' | 
				'cancellation' | 'overtime'
				// |
				// 'financeSendGroup' |
				// 'financeChange' |
				// 'administrativeSendGroup' |
				// 'administrativeChange'