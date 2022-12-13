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
				'cancellation' | 'overtime' | 'waitRegiment' | 'waitingTask'
				// |
				

export type AuditField = 'financeSendGroup' |
								'financeChange' |
								'administrativeSendGroup' |
								'administrativeChange'|
								'withdrawalChange'

export type TakeGroupField = 'drafts' | 
                'waitingGroup' |
                'waitingReserved' | 
                'dispatched' |
                'cancellation' |
                'waitingChange' |
                'overtime' |
                'waitingOutGroup' | 
				'waitingHandle'