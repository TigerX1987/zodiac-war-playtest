
const labels = {"aries":"白羊座","leo":"狮子座","sagittarius":"射手座","gemini":"双子座","libra":"天秤座","aquarius":"水瓶座","cancer":"巨蟹座","scorpio":"天蝎座","pisces":"双鱼座","taurus":"金牛座","virgo":"处女座","capricorn":"摩羯座"};
const skillDescriptions = {"aries.bloodRage":{"name":"金绒战意","tag":"被动","summary":"回合外因非神圣伤害掉血后，下个主动回合首次金角冲伤害＋1。","details":["本回合只能增伤一次；没有在本回合用掉，不延续到以后回合。"],"text":"被动。回合外因非神圣伤害掉血后，下个主动回合首次金角冲伤害＋1。 本回合只能增伤一次；没有在本回合用掉，不延续到以后回合。"},"aries.ram":{"name":"金角冲","tag":"主动·每回合1次","summary":"消耗1张火基础攻击，令目标受到1点不可防御伤害；用火状态攻击支付时，附加灼烧。","details":["不占基础攻击次数；圣盾可抵消，致盲会使其落空。遵守现有距离费用；标准模式不能指定队友。","与燃魂共用金角冲的每回合次数。"],"text":"主动·每回合1次。消耗1张火基础攻击，令目标受到1点不可防御伤害；用火状态攻击支付时，附加灼烧。 不占基础攻击次数；圣盾可抵消，致盲会使其落空。遵守现有距离费用；标准模式不能指定队友。 与燃魂共用金角冲的每回合次数。"},"aries.burnSoul":{"name":"燃魂","tag":"主动·每回合1次","summary":"可用1张非火基础攻击支付金角冲的费用。","details":["不改变费用牌的属性和牌面效果；非火状态攻击不因此附加灼烧。AOE及其他类型牌不能支付；仍消耗金角冲次数。"],"text":"主动·每回合1次。可用1张非火基础攻击支付金角冲的费用。 不改变费用牌的属性和牌面效果；非火状态攻击不因此附加灼烧。AOE及其他类型牌不能支付；仍消耗金角冲次数。"},"leo.aura":{"name":"狮威","tag":"被动","summary":"你存活时，灼烧中的角色不能普通回复；太阳仍可回复。","details":["限制同时影响友方和敌方。"],"text":"被动。你存活时，灼烧中的角色不能普通回复；太阳仍可回复。 限制同时影响友方和敌方。"},"leo.roar":{"name":"狮吼","tag":"主动·每回合1次","summary":"弃1张火牌，令1至3名其他角色灼烧1轮。","details":["已灼烧的目标不叠层、不刷新持续时间。"],"text":"主动·每回合1次。弃1张火牌，令1至3名其他角色灼烧1轮。 已灼烧的目标不叠层、不刷新持续时间。"},"leo.order":{"name":"兽王令","tag":"主动·每回合1次","summary":"弃1牌指定另一名角色；至你下回合开始前，其对你用牌须交给你1牌，否则该牌失效。","details":["指定对象须存活；交牌属于发动后的响应费用。"],"text":"主动·每回合1次。弃1牌指定另一名角色；至你下回合开始前，其对你用牌须交给你1牌，否则该牌失效。 指定对象须存活；交牌属于发动后的响应费用。"},"sagittarius.bowcraft":{"name":"整弓","tag":"被动","summary":"你的装备被拆、被替换或被夺走时，摸2牌。","details":[],"text":"被动。你的装备被拆、被替换或被夺走时，摸2牌。"},"sagittarius.seekEquipment":{"name":"寻器","tag":"主动·每回合1次","summary":"弃1张火牌＋1张任意牌，随机获得牌库1件武器或防具；没有装备则返还费用。","details":["两张费用必须不同。"],"text":"主动·每回合1次。弃1张火牌＋1张任意牌，随机获得牌库1件武器或防具；没有装备则返还费用。 两张费用必须不同。"},"sagittarius.sharpshot":{"name":"缪斯之弦","tag":"被动","summary":"有武器：每回合额外攻击次数＋装备数，仅额外火攻击不可防御。有防具：非神圣掉血存活后，可令一人补牌至生命上限，手牌最多4张。","details":["额外次数仅用于普通、状态攻击，各属性共用；AOE不享受。更换装备不重置已用次数；额外次数之外的火牌照常防御。","不可防御不等于必中，仍受致盲、圣盾、护甲、净域影响。非火额外攻击可正常防御。","补牌只由非神圣的实际生命损失触发，可选择自己或其他存活角色，不限次数、可放弃；先急救，存活后再选。已有手牌超过上限不弃牌。"],"text":"被动。有武器：每回合额外攻击次数＋装备数，仅额外火攻击不可防御。有防具：非神圣掉血存活后，可令一人补牌至生命上限，手牌最多4张。 额外次数仅用于普通、状态攻击，各属性共用；AOE不享受。更换装备不重置已用次数；额外次数之外的火牌照常防御。 不可防御不等于必中，仍受致盲、圣盾、护甲、净域影响。非火额外攻击可正常防御。 补牌只由非神圣的实际生命损失触发，可选择自己或其他存活角色，不限次数、可放弃；先急救，存活后再选。已有手牌超过上限不弃牌。"},"gemini.windForm":{"name":"双生","tag":"被动","summary":"每因非神圣伤害失去1点生命，摸1张风牌。","details":["仅减少护甲不触发。濒死先急救，存活后再摸牌；不能先摸牌找急救。"],"text":"被动。每因非神圣伤害失去1点生命，摸1张风牌。 仅减少护甲不触发。濒死先急救，存活后再摸牌；不能先摸牌找急救。"},"gemini.steal":{"name":"换影","tag":"主动·每回合1次","summary":"弃2牌，或弃1牌并失去1血；查看并获得目标1张手牌或装备，非风牌则造成1点普通伤害。目标原本无牌无装备时，改为造成1伤并致盲。","details":["只能指定另一名存活角色，无距离限制。取牌分支不致盲；空手但仍有装备时，须走取装备分支。"],"text":"主动·每回合1次。弃2牌，或弃1牌并失去1血；查看并获得目标1张手牌或装备，非风牌则造成1点普通伤害。目标原本无牌无装备时，改为造成1伤并致盲。 只能指定另一名存活角色，无距离限制。取牌分支不致盲；空手但仍有装备时，须走取装备分支。"},"gemini.extraTurn":{"name":"连星","tag":"被动·每轮1次","summary":"本回合使用第3张风牌后，获得1个额外回合。","details":["换影消耗的风牌也计入；每轮最多触发一次。"],"text":"被动·每轮1次。本回合使用第3张风牌后，获得1个额外回合。 换影消耗的风牌也计入；每轮最多触发一次。"},"libra.elementSense":{"name":"衡感","tag":"被动·每轮每种属性1次","summary":"自己的主动回合内，首次正式使用一种属性牌时，摸1牌。","details":["回合外防御不触发，也不占用资格；每轮最多四种。太阳、月亮使用时选一种属性。弃牌和支付技能费用不算正式使用；额外回合沿用本轮记录。"],"text":"被动·每轮每种属性1次。自己的主动回合内，首次正式使用一种属性牌时，摸1牌。 回合外防御不触发，也不占用资格；每轮最多四种。太阳、月亮使用时选一种属性。弃牌和支付技能费用不算正式使用；额外回合沿用本轮记录。"},"libra.judgment":{"name":"审判","tag":"被动·每项每回合1次","summary":"主动回合用到第3种属性：令一人致盲；第4种：选一人，获得其1张手牌或造成1点普通伤害。","details":["须正式使用不同属性牌；两项效果各触发一次，不按牌张数累计，也不提供额外回合。"],"text":"被动·每项每回合1次。主动回合用到第3种属性：令一人致盲；第4种：选一人，获得其1张手牌或造成1点普通伤害。 须正式使用不同属性牌；两项效果各触发一次，不按牌张数累计，也不提供额外回合。"},"libra.harmony":{"name":"裁衡","tag":"主动·每回合1次","summary":"选另两人，牌差须≥2。弃牌差一半（向下取整）的风牌，将多牌者等量手牌或装备交给少牌者。","details":["两名对象须不同且存活；牌差仅按手牌数计算，费用与转移数量相同。"],"text":"主动·每回合1次。选另两人，牌差须≥2。弃牌差一半（向下取整）的风牌，将多牌者等量手牌或装备交给少牌者。 两名对象须不同且存活；牌差仅按手牌数计算，费用与转移数量相同。"},"aquarius.stormEye":{"name":"倾杯","tag":"被动","summary":"非神圣掉血并存活后，摸2牌；可与最多2人交换合计最多2张手牌。友方明选，敌方随机。","details":["交出、取回须等量；仅交换手牌，不能选自己。敌方手牌只显示卡背，不能指定取牌；从交换前手牌随机抽取。","神酿献祭也会触发；濒死先急救，存活再摸牌。只损失护甲不触发。"],"text":"被动。非神圣掉血并存活后，摸2牌；可与最多2人交换合计最多2张手牌。友方明选，敌方随机。 交出、取回须等量；仅交换手牌，不能选自己。敌方手牌只显示卡背，不能指定取牌；从交换前手牌随机抽取。 神酿献祭也会触发；濒死先急救，存活再摸牌。只损失护甲不触发。"},"aquarius.massHeal":{"name":"神酿","tag":"主动·每回合1次","summary":"弃2牌（至少1风）；双风先自回1血。随后你失去1血，所有存活角色回复1血。","details":["两张费用必须不同。全部回复遵守生命上限、狮威与月蚀感染等普通恢复限制；献祭会触发倾杯，濒死先急救。"],"text":"主动·每回合1次。弃2牌（至少1风）；双风先自回1血。随后你失去1血，所有存活角色回复1血。 两张费用必须不同。全部回复遵守生命上限、狮威与月蚀感染等普通恢复限制；献祭会触发倾杯，濒死先急救。"},"aquarius.windCut":{"name":"断流","tag":"弃牌后·每轮1次·可选","summary":"弃牌阶段一次弃至少2牌后，可弃另一人2张手牌，再对其造成1点普通伤害。","details":["目标须存活，手牌不足2张则全弃；选定其手牌，先弃牌后伤害。"],"text":"弃牌后·每轮1次·可选。弃牌阶段一次弃至少2牌后，可弃另一人2张手牌，再对其造成1点普通伤害。 目标须存活，手牌不足2张则全弃；选定其手牌，先弃牌后伤害。"},"cancer.tideBond":{"name":"共潮","tag":"被动·每轮最多3次","summary":"任意角色成功回复生命后，你摸1牌。","details":["满血而未实际回复不触发。"],"text":"被动·每轮最多3次。任意角色成功回复生命后，你摸1牌。 满血而未实际回复不触发。"},"cancer.heal":{"name":"疗潮","tag":"主动·每回合1次","summary":"弃1牌，令一名存活角色回复1点生命。","details":["可选择自己；普通回复限制照常生效，不能用来急救濒死角色。"],"text":"主动·每回合1次。弃1牌，令一名存活角色回复1点生命。 可选择自己；普通回复限制照常生效，不能用来急救濒死角色。"},"cancer.rescue":{"name":"赫拉之护","tag":"回合外·每轮1次","summary":"弃1张水牌，将另一名濒死角色救至1血。","details":["不能自救；遵守现有普通急救限制。"],"text":"回合外·每轮1次。弃1张水牌，将另一名濒死角色救至1血。 不能自救；遵守现有普通急救限制。"},"scorpio.freezeAoe":{"name":"蝎毒","tag":"主动·每回合1次","summary":"弃1张水牌＋1张任意牌，冰冻另一人，再查看并获得其1张手牌；仅当其没有手牌时，改为造成1点普通伤害。","details":["两张费用必须不同，允许双水。先付费、结算冰冻，再查看手牌；只能取手牌，不能取装备，夺牌不追加伤害、不解除冰冻。"],"text":"主动·每回合1次。弃1张水牌＋1张任意牌，冰冻另一人，再查看并获得其1张手牌；仅当其没有手牌时，改为造成1点普通伤害。 两张费用必须不同，允许双水。先付费、结算冰冻，再查看手牌；只能取手牌，不能取装备，夺牌不追加伤害、不解除冰冻。"},"scorpio.peek":{"name":"窥星","tag":"摸牌前锁定·回合末可选","summary":"摸牌前查看牌顶3／4／5张，任意排至牌顶或牌底。未见水牌时，回合末可再排一次。","details":["少于4人看3张、4人看4张、5人及以上看5张；不足时看现有牌。开局排序强制且不受沉默影响；回合末保底只排序，不额外摸牌。"],"text":"摸牌前锁定·回合末可选。摸牌前查看牌顶3／4／5张，任意排至牌顶或牌底。未见水牌时，回合末可再排一次。 少于4人看3张、4人看4张、5人及以上看5张；不足时看现有牌。开局排序强制且不受沉默影响；回合末保底只排序，不额外摸牌。"},"scorpio.spoils":{"name":"缴械","tag":"主动·每回合1次","summary":"弃1牌，夺取另一人1点护甲、圣盾或一件装备；三者皆无，改为造成1点普通伤害。","details":["每次只选一项；自身护甲已满不能选护甲，装备正常替换。无需先冰冻。"],"text":"主动·每回合1次。弃1牌，夺取另一人1点护甲、圣盾或一件装备；三者皆无，改为造成1点普通伤害。 每次只选一项；自身护甲已满不能选护甲，装备正常替换。无需先冰冻。"},"pisces.observeTide":{"name":"观潮","tag":"主动·每回合1次","summary":"弃任意张手牌，再摸等量牌。","details":["无牌数上限；确认前可调整或取消。"],"text":"主动·每回合1次。弃任意张手牌，再摸等量牌。 无牌数上限；确认前可调整或取消。"},"pisces.balance":{"name":"双鱼之绊","tag":"主动·每回合1次","summary":"选两名角色，弃等同生命差的水牌，使双方生命调整至平均值（向下取整）。","details":["两人须不同且存活，可包含自己；生命增加仍受普通回复限制。生命减少属于调整生命，不视为伤害。"],"text":"主动·每回合1次。选两名角色，弃等同生命差的水牌，使双方生命调整至平均值（向下取整）。 两人须不同且存活，可包含自己；生命增加仍受普通回复限制。生命减少属于调整生命，不视为伤害。"},"pisces.dream":{"name":"归潮","tag":"被动","summary":"弃牌阶段结束后摸1牌；本回合双鱼之绊改变过生命，则改摸2牌。","details":["以实际生命变化为准；因恢复限制没有改变生命时，不视作已经回复。"],"text":"被动。弃牌阶段结束后摸1牌；本回合双鱼之绊改变过生命，则改摸2牌。 以实际生命变化为准；因恢复限制没有改变生命时，不视作已经回复。"},"taurus.guard":{"name":"护渡","tag":"回合开始·可选","summary":"弃1牌设定或更换一名守护对象；其成为攻击牌目标时，你可免费代承并正常防御。不更换则延续。","details":["同时仅守护一名其他存活角色；普通攻击、状态攻击、AOE均可代承，次数不限。直接技能伤害不触发；拒绝一次不解除守护。"],"text":"回合开始·可选。弃1牌设定或更换一名守护对象；其成为攻击牌目标时，你可免费代承并正常防御。不更换则延续。 同时仅守护一名其他存活角色；普通攻击、状态攻击、AOE均可代承，次数不限。直接技能伤害不触发；拒绝一次不解除守护。"},"taurus.thickSkin":{"name":"神躯","tag":"被动","summary":"受到唯一指向性卡牌攻击时摸1牌。卡牌或技能攻击使你失去护甲或生命后，可弃1牌，沉默来源至其下回合开始；已沉默则对其造成1点普通伤害。","details":["仅普通攻击、属性攻击、元素对决；Boss扩为多目标仍触发，AOE不触发。防御或伤害结算前摸牌，新牌可立即使用；同一卡牌的多段或代承只摸1张。","技能伤害不摸牌。神圣伤害不触发反击；反击来源须是其他存活角色。濒死先急救，存活后可反击；已沉默时不刷新持续时间。"],"text":"被动。受到唯一指向性卡牌攻击时摸1牌。卡牌或技能攻击使你失去护甲或生命后，可弃1牌，沉默来源至其下回合开始；已沉默则对其造成1点普通伤害。 仅普通攻击、属性攻击、元素对决；Boss扩为多目标仍触发，AOE不触发。防御或伤害结算前摸牌，新牌可立即使用；同一卡牌的多段或代承只摸1张。 技能伤害不摸牌。神圣伤害不触发反击；反击来源须是其他存活角色。濒死先急救，存活后可反击；已沉默时不刷新持续时间。"},"taurus.armor":{"name":"筑甲","tag":"主动·每回合1次","summary":"弃1张土牌，自己获得1点护甲。","details":["不能超过护甲上限。"],"text":"主动·每回合1次。弃1张土牌，自己获得1点护甲。 不能超过护甲上限。"},"virgo.purify":{"name":"净化","tag":"主动·每回合1次","summary":"弃1张土牌，清除目标全部普通异常；没有普通异常则获得一次异常免疫。月蚀中可改为仅清除感染。","details":["普通异常与感染二选一；不能借此改变已经转化的阵营身份。"],"text":"主动·每回合1次。弃1张土牌，清除目标全部普通异常；没有普通异常则获得一次异常免疫。月蚀中可改为仅清除感染。 普通异常与感染二选一；不能借此改变已经转化的阵营身份。"},"virgo.domain":{"name":"净域","tag":"锁定","summary":"每回合首次受非神圣伤害并存活后，本回合免疫后续非神圣伤害和新增负面状态。","details":["损失护甲也可触发，首击照常结算；已有负面不清除。神圣伤害、生命调整和失去生命的费用仍可穿透。濒死先急救，存活再生效。"],"text":"锁定。每回合首次受非神圣伤害并存活后，本回合免疫后续非神圣伤害和新增负面状态。 损失护甲也可触发，首击照常结算；已有负面不清除。神圣伤害、生命调整和失去生命的费用仍可穿透。濒死先急救，存活再生效。"},"virgo.discipline":{"name":"星律","tag":"被动·可选","summary":"其他角色以AOE或多目标牌、技能指定你，结算后你可对来源造成1点普通伤害。","details":["每次符合条件均可选择发动，不限制每回合次数；只能反击施放者。"],"text":"被动·可选。其他角色以AOE或多目标牌、技能指定你，结算后你可对来源造成1点普通伤害。 每次符合条件均可选择发动，不限制每回合次数；只能反击施放者。"},"infection.bossDrain":{"name":"月蚀汲取","text":"被动。Boss 主动回合首次对其他角色造成实际生命伤害后，回复 1 点生命并摸 1 张牌；满血时仍摸牌并消耗本回合触发次数。"},"infection.bossCommand":{"name":"蚀月战令","text":"Boss 开局额外摸 2 张牌。每个主动回合限一次，选择一项：本回合可额外使用 1 张基础攻击牌；或令本回合 1 张基础攻击牌额外指定 1 个目标。"},"infection.bossNoDistance":{"name":"月蚀领域","text":"被动。Boss 使用卡牌和技能无距离限制，不需要支付跨距离费用。"},"weapon.waterCodex":{"name":"潮汐法典","text":"每回合限一次，将任意 2 张手牌合成为 1 张本角色属性牌。攻击素材决定打击次数；武器素材令攻击必中且不可防御；防具素材令使用者获得 1 点护甲。"},"weapon.airCompass":{"name":"命运罗盘","text":"主动回合限一次。正式使用过 2 张不同属性牌后，选择一种属性，获得牌库中的 1 张该属性牌。"},"capricorn.unyielding":{"name":"牧神怒","tag":"被动","summary":"每次对他人造成实际伤害，或承受他人非神圣实际伤害，获得1点怒气。","details":["造成神圣伤害也能蓄怒；受神圣伤害、自伤或伤害完全被圣盾抵消时不增加。怒气没有上限。"],"text":"被动。每次对他人造成实际伤害，或承受他人非神圣实际伤害，获得1点怒气。 造成神圣伤害也能蓄怒；受神圣伤害、自伤或伤害完全被圣盾抵消时不增加。怒气没有上限。"},"capricorn.wushuang":{"name":"重压","tag":"被动","summary":"你的土基础攻击，需要目标用2张有效防御牌抵消。","details":["仅普通、状态攻击生效；非土牌、AOE、技能及装备伤害不触发。"],"text":"被动。你的土基础攻击，需要目标用2张有效防御牌抵消。 仅普通、状态攻击生效；非土牌、AOE、技能及装备伤害不触发。"},"capricorn.charge":{"name":"山崩","tag":"主动·每轮1次","summary":"耗尽怒气：1–2怒令一人沉默；3–4怒再造成1点神圣伤害；≥5怒可单体2伤，或1至3人各1点神圣伤害。","details":["至少1怒，无需土牌；所选目标均受沉默。3–4怒后，你弃全部手牌；≥5怒后，你和目标弃全部手牌、装备。","跨距离额外弃1牌，多目标合计只付一次；遇急救、月蚀奖励时暂停，处理后继续剩余目标。"],"text":"主动·每轮1次。耗尽怒气：1–2怒令一人沉默；3–4怒再造成1点神圣伤害；≥5怒可单体2伤，或1至3人各1点神圣伤害。 至少1怒，无需土牌；所选目标均受沉默。3–4怒后，你弃全部手牌；≥5怒后，你和目标弃全部手牌、装备。 跨距离额外弃1牌，多目标合计只付一次；遇急救、月蚀奖励时暂停，处理后继续剩余目标。"}};
const serverVersion = "web-c494c61c45e72605";
const clientGameModes = {"test":{"seatCount":4,"playerCounts":[4],"randomCharacters":false,"characters":["aries","cancer","gemini","capricorn"],"controls":["human","ai","ai","ai"],"playerNames":["A队前锋","A队辅助","B队前锋","B队终结"]},"standard":{"seatCount":4,"playerCounts":[4,6],"randomCharacters":true,"characters":["aries","cancer","gemini","capricorn","taurus","aquarius"],"controls":["human","ai","ai","ai","ai","ai"],"playerNames":["A队前锋","A队辅助","B队前锋","B队终结"]},"infection":{"seatCount":4,"playerCounts":[4,5,6,7,8],"randomCharacters":true,"characters":["aries","cancer","aquarius","taurus","virgo","sagittarius","libra","pisces"],"controls":["human","ai","ai","ai","ai","ai","ai","ai"],"playerNames":["1号位","2号位","3号位","4号位","5号位","6号位","7号位","8号位"]}};
const allSeatIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
const infoOnlySkills = new Set([
  'aries.bloodRage',
  'leo.aura',
  'gemini.extraTurn',
  'libra.elementSense',
  'libra.judgment',
  'aquarius.stormEye',
  'aquarius.windCut',
  'cancer.tideBond',
  'cancer.rescue',
  'pisces.dream',
  'taurus.thickSkin',
  'gemini.windForm',
  'capricorn.unyielding',
  'capricorn.wushuang',
  'sagittarius.bowcraft',
  'sagittarius.sharpshot',
  'virgo.domain',
  'virgo.discipline',
  'infection.bossDrain',
  'infection.bossNoDistance'
]);
let state = null;
let tutorial = null;
let config = { mode: "test", characters: ["aries","cancer","gemini","capricorn"], controls: ["human","ai","ai","ai"], playerCount: 4 };
let lobbyOpen = true;
let setupPaused = true;
let setupFateDrawn = false;
let setupRevealReady = false;
let setupRevealKey = '';
let setupRevealTimer = null;
const MULLIGAN_SECONDS = 8;
const MAIN_TOTAL_SECONDS = 65;
const MAIN_IDLE_SECONDS = 20;
const RESPONSE_TOTAL_SECONDS = 35;
const RESPONSE_IDLE_SECONDS = 10;
const TIMER_SPEEDUP = 5;
const FINAL_NORMAL_SECONDS = 3;
const AI_ACTION_DELAY_MS = 3000;
let mulliganDeadline = null;
let actionDeadline = null;
let actionStartedAt = null;
let finishingMulliganTimeout = false;
let mulliganChoiceInFlight = false;
let finishingActionTimeout = false;
let advancingAi = false;
let lastMulliganFocusId = '';
let error = '';
let visible = { p1: true, p2: false, p3: false, p4: false };
let selectedSkills = {};
let skillDecisionDrafts = {};
let boardSkillUI = { key: '', stage: 'targets', targetIds: [] };
let boardSkillBusy = false;
let libraHarmonyDrafts = {};
let piscesBalanceDrafts = {};
let skillInfoAutoHideTimer = null;
let ariesRamDrafts = {};
let leoRoarDrafts = {};
let capricornChargeDrafts = {};
let capricornChargeInFlight = false;
let leoOrderDrafts = {};
let cancerHealDrafts = {};
let taurusArmorDrafts = {};
let stealDrafts = {};
let aquariusChaliceDrafts = {};
let aquariusChaliceInFlight = false;
let aquariusMassHealDrafts = {};
let sagittariusSeekDrafts = {};
let sagittariusResupplyInFlight = false;
let virgoPurifyDrafts = {};
let peekDrafts = {};
let taurusDecisionInFlight = false;
let scorpioPeekInFlight = false;
let scorpioPoisonTakeInFlight = false;
let scorpioDisarmInFlight = false;
let scorpioPoisonDrafts = {};
let spoilsDrafts = {};
let targetDrafts = {};
let selectedEquipment = {};
let inspectedPlayerId = '';
let inspectedSection = 'skills';
let waterCodexDrafts = {};
let piscesObserveTideDrafts = {};
let previousState = null;
let latestEffect = null;
let hitAudioContext = null;
let lastHitSoundKey = '';
let draggedCard = null;
let selectedCard = null;
let distanceCostDraft = null;
let leoOrderPaymentDraft = null;
let waterStealDraft = null;
let airDismantleDraft = null;
let discardDrafts = {};
let aiAdvanceNotBefore = 0;
let aiAdvanceDelayKey = '';
let localHumanPlayerId = "p1";
let settlementStatsExpanded = false;
let stageLogOpen = false;
let seatSkillTip = null;
let seatSkillTipTimer = null;
let clientMatchId = '';

function cardText(card) {
  const kinds = { normalAttack: '普攻', statusAttack: '状态', energy: '星能', utility: '功能', aoe: 'AOE', weapon: '武器', armor: '防具', sun: '太阳', moon: '月亮' };
  return card.name + ' · ' + kinds[card.kind];
}

function statuses(player) {
  const keys = Object.keys(player.statuses || {});
  return keys.length ? keys.join(' / ') : '无';
}

function shouldShowRage(player) {
  return player.characterId === 'capricorn';
}

function isBasicAttackCard(card) {
  return card.kind === 'normalAttack' || card.kind === 'statusAttack';
}

function basicAttackLimit(player) {
  const commandBonus = player.flags?.infectionBossCommandMode === 'extraAttack' ? 1 : 0;
  return player.equipment.weapon?.element === 'fire' ? Number.POSITIVE_INFINITY : 1 + commandBonus;
}

function canPlayMoreBasicAttacks(player) {
  const equipmentCount = Number(Boolean(player.equipment.weapon)) + Number(Boolean(player.equipment.armor));
  const extraAvailable = player.characterId === 'sagittarius' && Boolean(player.equipment.weapon) &&
    (player.flags.usedSagittariusExtraAttacks || 0) < equipmentCount;
  return player.flags.basicAttackCount < basicAttackLimit(player) || extraAvailable;
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const ELEMENT_VISUALS = {
  fire: { label: '火', icon: '炎', className: 'fire', hint: '爆发伤害' },
  water: { label: '水', icon: '潮', className: 'water', hint: '冻结控制' },
  air: { label: '风', icon: '风', className: 'air', hint: '致盲机动' },
  earth: { label: '土', icon: '岩', className: 'earth', hint: '沉默防护' }
};
const FALLBACK_VISUALS = {
  utility: { label: '功能', icon: '策', className: 'utility', hint: '战术功能' },
  ritual: { label: '仪式', icon: '净', className: 'ritual', hint: '净化或感染' },
  aoe: { label: 'AOE', icon: '域', className: 'aoe', hint: '群体攻击' },
  weapon: { label: '武器', icon: '武', className: 'weapon', hint: '装备武器' },
  armor: { label: '防具', icon: '甲', className: 'armor', hint: '装备防具' },
  sun: { label: '太阳', icon: '日', className: 'sun', hint: '回血 · 急救 · 防御' },
  moon: { label: '月亮', icon: '月', className: 'moon', hint: '反击或完美防御' },
  energy: { label: '星能', icon: '星', className: 'energy', hint: '任意属性蓄能' }
};
const KIND_LABELS = {
  normalAttack: '普通攻击',
  statusAttack: '状态攻击',
  energy: '星能',
  ritual: '仪式',
  utility: '功能',
  aoe: 'AOE',
  weapon: '武器',
  armor: '防具',
  sun: '太阳',
  moon: '月亮'
};
const CHARACTER_ELEMENTS = {
  aries: 'fire',
  leo: 'fire',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
  taurus: 'earth',
  capricorn: 'earth',
  sagittarius: 'fire',
  virgo: 'earth'
};

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function assetUrl(folder, name, ext) {
  return '/zodiac-war-playtest/assets/' + folder + '/' + encodeURIComponent(name) + '.' + ext;
}

function assetUrls(folder, names) {
  // 优先 webp（cards/characters 已转 webp，体积约为原 PNG 的 1/7），其余扩展名作为回退。
  // 对未转换的目录（如 assets/ui，仍是 png）无副作用——首个地址 404 后由 onerror 回退。
  return uniqueValues(names).flatMap(name => ['webp', 'png', 'jpg', 'jpeg'].map(ext => assetUrl(folder, name, ext)));
}

function fallbackAssetImage(image) {
  const fallbacks = (image.dataset.fallbacks || '').split('|').filter(Boolean);
  const next = fallbacks.shift();
  if (next) {
    image.dataset.fallbacks = fallbacks.join('|');
    image.src = next;
    return;
  }
  image.remove();
}

function assetImageHtml(className, urls, altText) {
  const [first, ...fallbacks] = urls;
  if (!first) return '';
  return '<img class="' + safeText(className) + '" src="' + safeText(first) + '" data-fallbacks="' + safeText(fallbacks.join('|')) + '" alt="' + safeText(altText) + '" loading="lazy" onerror="fallbackAssetImage(this)" />';
}

function kindLabel(card) {
  return KIND_LABELS[card.kind] || card.kind;
}

function effectiveCardForView(player, card) {
  if (!player || card?.kind !== 'ritual' || state?.mode !== 'infection') return card;
  const infected = player.factionId === 'infected';
  return {
    ...card,
    name: (ELEMENT_VISUALS[card.element]?.label || '') + (infected ? '感染牌' : '净化仪式')
  };
}

function battleDisplayName(player) {
  const visual = characterVisual(player);
  if (state?.mode === 'infection') {
    return (player.factionId === 'infected' ? '感染方' : '幸存者') + visual.name;
  }
  return player.teamId + '队' + visual.name;
}

function visualForCard(card) {
  if (card.element && ELEMENT_VISUALS[card.element]) return ELEMENT_VISUALS[card.element];
  return FALLBACK_VISUALS[card.kind] || { label: '牌', icon: '牌', className: 'utility', hint: '按牌面结算' };
}

function cardAssetNames(card) {
  if (!card) return [];
  const kindSlug = {
    normalAttack: 'normal',
    statusAttack: 'status',
    energy: 'energy',
    ritual: 'ritual',
    aoe: 'aoe',
    utility: 'utility',
    weapon: 'weapon',
    armor: 'armor',
  }[card.kind];
  return uniqueValues([
    card.id,
    card.kind === 'sun' ? 'sun' : '',
    card.kind === 'moon' ? 'moon' : '',
    card.element && kindSlug ? card.element + '-' + kindSlug : '',
  ]);
}

function cardAssetUrls(card) {
  const textlessName = cardAssetNames(card).find(name => /^(sun|moon|(fire|water|air|earth)-(normal|status|energy|aoe|utility|weapon|armor))$/.test(name));
  if (textlessName) return [assetUrl('cards-textless-v1', textlessName, 'webp')];
  return uniqueValues(cardAssetNames(card).map(name => assetUrl('cards-v10', name, 'webp')).concat(assetUrls('cards', cardAssetNames(card))));
}

function characterAssetUrls(characterId) {
  return [assetUrl('portraits-v11', characterId + '-640', 'webp')];
}

function cardEffectText(card) {
  if (card.fusion) {
    const effects = [];
    if (card.fusion.attackCount >= 2) effects.push('包含 2 张攻击素材，命中时独立结算两次攻击与防御');
    if (card.fusion.grantsArmor) effects.push('使用时获得 1 点护甲');
    if (card.fusion.sureHit) {
      effects.push(card.fusion.attackCount > 0
        ? '本牌必中且不可防御，并无视致盲'
        : '本牌不造成攻击，改为获得持续“必中”；下次普通攻击必中且不可防御');
    }
    if (!card.fusion.sureHit && (card.kind === 'statusAttack' || card.kind === 'aoe')) {
      effects.push('只能用同属性普通攻击或太阳/月亮完美防御');
    }
    return '潮汐合成牌。' + effects.join('；') + '。';
  }
  if (card.kind === 'normalAttack') return '回合内发起攻击；回合外可作为防御牌。';
  if (card.kind === 'statusAttack') return '命中后造成伤害并附加异常；同属性防御可完美防御。';
  if (card.kind === 'energy') return '主动使用任意属性星能后，本回合下一张任意属性的普通攻击或状态攻击伤害 +1，不强化 AOE 或技能伤害；仅在角色濒死阶段可用于急救，阵亡判定后不能急救。';
  if (card.kind === 'ritual') return card.name.includes('感染牌')
    ? '无距离指定一名尚未感染的幸存者施加感染；目标可用太阳或净化仪式抵消。'
    : '无距离移除一名幸存者的感染；也可响应并抵消感染牌。';
  if (card.kind === 'aoe') return '对所有敌方角色结算一次属性攻击。';
  if (card.kind === 'weapon') return '装备到武器槽，提供攻击相关效果。';
  if (card.kind === 'armor') return '装备到防具槽，提供防御相关效果。';
  if (card.kind === 'sun') return '主动使用：指定角色回复 1 点并净化，自己摸 1 张本属性牌；仅在角色濒死阶段可用于急救，阵亡判定后不能急救；也可完美防御。';
  if (card.kind === 'moon') return '主动使用：弃目标 1 张牌并沉默；也可在自己攻击结算时令本次伤害 +1，或完美防御反击。';
  return '功能牌，按当前规则文本结算。';
}

function equipmentEffectText(card) {
  if (!card) return '未装备。';
  if (card.kind === 'weapon') {
    if (card.element === 'fire') return '流火机括：装备期间，主动回合打出普通攻击牌和状态攻击牌不受次数限制；装备武器后，跨距离输出不再支付额外手牌。';
    if (card.element === 'water') return '潮汐法典：每回合限一次，将任意 2 张手牌合成为 1 张本角色属性牌。攻击素材决定打击次数；武器素材令攻击必中且不可防御；防具素材令使用者获得 1 点护甲。';
    if (card.element === 'air') return '命运罗盘：主动回合限一次，正式使用过 2 张不同属性牌后，选择一种属性并获得牌库中的 1 张该属性牌。';
    if (card.element === 'earth') return '撼岳锤：主动回合限一次。首次普通攻击被防御时，目标须额外交出 1 张手牌，否则防御无效。';
  }
  if (card.kind === 'armor') {
    if (card.element === 'fire') return '烈焰披风：每回合首次受到伤害后，伤害来源获得灼烧。';
    if (card.element === 'water') return '寒冰护甲：受到实际伤害后，限制伤害来源本回合继续输出。';
    if (card.element === 'air') return '飓风斗篷：受到首次实际伤害后，令伤害来源弃 1 张牌。';
    if (card.element === 'earth') return '石壁：单次伤害最多为 1；每轮首次受到伤害再减 1；离开装备区时，存活的装备者回复 1 点生命。';
  }
  return cardEffectText(card);
}

function renderHandCard(player, card, enabled, handler, dragAttrs = '', extraClass = '', inlineStyle = '') {
  card = effectiveCardForView(player, card);
  const visual = visualForCard(card);
  const elementText = card.element && ELEMENT_VISUALS[card.element] ? ELEMENT_VISUALS[card.element].label : visual.label;
  const cardImages = cardAssetUrls(card);
  const classes = ['card', visual.className, 'kind-' + card.kind, cardImages.length ? 'hasCardArt' : '', dragAttrs ? 'dragTarget' : '', extraClass].filter(Boolean).join(' ');
  const click = handler ? ' onclick="' + handler + '"' : '';
  const drag = dragAttrs ? ' ' + dragAttrs : '';
  const style = inlineStyle ? ' style="' + inlineStyle + '"' : '';
  return '<button class="' + classes + '" data-player-id="' + safeText(player.id) + '" data-card-id="' + safeText(card.id) + '"' + style + ' ' + (enabled ? '' : 'disabled') + drag + click + '>' +
    assetImageHtml('cardArt', cardImages, card.name) +
    '<div class="cardTop"><span>' + safeText(elementText) + '</span><span>' + safeText(kindLabel(card)) + '</span></div>' +
    '<div class="cardIcon">' + safeText(visual.icon) + '</div>' +
    '<div class="cardName">' + safeText(card.name) + '</div>' +
    '<div class="cardEffect">' + safeText(cardEffectText(card)) + '</div>' +
    '<div class="cardBottom" title="' + safeText(visual.hint) + '"><span>' + safeText(visual.hint) + '</span></div>' +
    '</button>';
}

function cardNeedsDragTarget(card) {
  return cardNeedsTarget(card);
}

function cardNeedsTarget(card) {
  if (card.kind === 'weapon' || card.kind === 'armor') return false;
  if (card.kind === 'normalAttack' || card.kind === 'statusAttack') return true;
  if (card.kind === 'aoe') return true;
  if (card.kind === 'sun') return true;
  if (card.kind === 'moon') return true;
  if (card.kind === 'ritual') return true;
  if (card.kind === 'utility') return card.element !== 'earth';
  return false;
}

function selectedCardPlayer() {
  return selectedCard ? state?.players.find(candidate => candidate.id === selectedCard.playerId) : null;
}

function selectedCardObject() {
  const player = selectedCardPlayer();
  return player?.hand.find(candidate => candidate.id === selectedCard.cardId) || null;
}

function startCardDrag(event, playerId, cardId) {
  const rect = event.currentTarget.getBoundingClientRect();
  draggedCard = {
    playerId,
    cardId,
    startX: rect.left + rect.width / 2,
    startY: rect.top + rect.height / 2
  };
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify(draggedCard));
  }
  updateDropReadyTargets();
  updateDragGuide(event);
}

function clearCardDrag() {
  draggedCard = null;
  hideDragGuide();
  resetDropReadyTargets();
}

function resetDropReadyTargets() {
  document.querySelectorAll('.seatCard.dropReady, .seatCard.dropTarget, .stageFocusCard.dropReady, .stageFocusCard.dropTarget').forEach(el => {
    el.classList.remove('dropReady');
    el.classList.remove('dropTarget');
  });
}

function updateDropReadyTargets() {
  document.querySelectorAll('.seatCard[data-player-id], .stageFocusCard[data-player-id]').forEach(el => {
    if (canDropCardOnSeat(draggedCard, el.dataset.playerId)) {
      el.classList.add('dropReady');
    } else {
      el.classList.remove('dropReady');
    }
  });
}

function updateDragGuide(event) {
  if (!draggedCard) return;
  const layer = document.getElementById('dragGuideLayer');
  const line = document.getElementById('dragGuideLine');
  const halo = document.getElementById('dragGuideHalo');
  if (!layer || !line || !halo) return;
  layer.classList.add('active');
  const endX = event.clientX ?? draggedCard.startX;
  const endY = event.clientY ?? draggedCard.startY;
  line.setAttribute('x1', String(draggedCard.startX));
  line.setAttribute('y1', String(draggedCard.startY));
  line.setAttribute('x2', String(endX));
  line.setAttribute('y2', String(endY));
  halo.setAttribute('cx', String(endX));
  halo.setAttribute('cy', String(endY));
}

function hideDragGuide() {
  const layer = document.getElementById('dragGuideLayer');
  if (layer) layer.classList.remove('active');
  const line = document.getElementById('dragGuideLine');
  if (line) line.classList.remove('targeting');
}

function updateSelectedCardGuide(event) {
  if (window.TabletopV10) return hideDragGuide();
  if (!selectedCard) {
    if (!draggedCard) hideDragGuide();
    return;
  }
  const card = selectedCardObject();
  if (!card || card.kind === 'aoe' || !cardNeedsTarget(card)) return hideDragGuide();
  const source = document.querySelector('.card.selectedCard');
  const layer = document.getElementById('dragGuideLayer');
  const line = document.getElementById('dragGuideLine');
  const halo = document.getElementById('dragGuideHalo');
  if (!source || !layer || !line || !halo) return;
  const rect = source.getBoundingClientRect();
  const x1 = rect.left + rect.width / 2;
  const y1 = rect.top + rect.height / 2;
  const x2 = event.clientX ?? x1;
  const y2 = event.clientY ?? y1;
  layer.classList.add('active');
  line.classList.add('targeting');
  line.setAttribute('x1', String(x1));
  line.setAttribute('y1', String(y1));
  line.setAttribute('x2', String(x2));
  line.setAttribute('y2', String(y2));
  halo.setAttribute('cx', String(x2));
  halo.setAttribute('cy', String(y2));
}

function canDropCardOnSeat(payload, targetId) {
  if (!payload || !state || state.phase !== 'main') return false;
  if (boardSkillBusy || boardSkillSelection() || sagittariusResupplySelection()) return false;
  const player = state.players.find(candidate => candidate.id === payload.playerId);
  const target = state.players.find(candidate => candidate.id === targetId);
  const card = player?.hand.find(candidate => candidate.id === payload.cardId);
  if (!player || !target || !card) return false;
  if (player.id !== state.activePlayerId) return false;
  if (target.hp <= 0 || target.eliminated) return false;
  if (card.kind === 'sun') {
    if (state.mode === 'infection') return target.id === player.id && canClickHandCard(player, card, true, false, false);
    return canClickHandCard(player, card, true, false, false);
  }
  if (card.kind === 'ritual' && state.mode === 'infection') {
    const validTarget = player.factionId === 'infected'
      ? target.factionId === 'survivor' && !target.infected
      : target.factionId === 'survivor' && target.infected;
    return validTarget && canClickHandCard(player, card, true, false, false);
  }
  if (state.mode === 'infection') {
    if (target.id === player.id) return false;
  } else if (target.teamId === player.teamId) {
    return false;
  }
  if (card.kind === 'utility' && card.element === 'water' && !canWaterStealTarget(player, target)) return false;
  return cardNeedsTarget(card) && canClickHandCard(player, card, true, false, false);
}

function targetIdsForSelectedCard() {
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  if (!player || !card) return [];
  if (card.kind === 'aoe') {
    return enemiesOf(player).filter(enemy => canDropCardOnSeat(selectedCard, enemy.id)).map(enemy => enemy.id);
  }
  if (canBossBasicAttackAddTarget(player, card)) return selectedCard?.targetIds || [];
  return [];
}

function canBossBasicAttackAddTarget(player, card) {
  return Boolean(
    isInitialInfectionBoss(player) &&
    (card?.kind === 'normalAttack' || card?.kind === 'statusAttack') &&
    player.flags?.infectionBossCommandMode === 'extraTarget' &&
    !player.flags?.usedInfectionBossExtraTarget
  );
}

function circularSeatDistance(player, target) {
  if (!state || !player || !target) return Number.POSITIVE_INFINITY;
  const seats = state.players.filter(candidate => candidate.hp > 0).sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const playerIndex = seats.findIndex(candidate => candidate.id === player.id);
  const targetIndex = seats.findIndex(candidate => candidate.id === target.id);
  if (playerIndex < 0 || targetIndex < 0) return Number.POSITIVE_INFINITY;
  const direct = Math.abs(playerIndex - targetIndex);
  return Math.min(direct, seats.length - direct);
}

function isCrossDistanceTarget(player, target) {
  if (!state || state.players.length <= 2 || !player || !target) return false;
  if (state.mode !== 'infection' && player.teamId === target.teamId) return false;
  return circularSeatDistance(player, target) > 1;
}

function isInitialInfectionBoss(player) {
  return Boolean(
    state?.mode === 'infection' &&
    player?.infectionRole === 'initial' &&
    state.infection?.bossPlayerId === player.id
  );
}

function canWaterStealTarget(player, target) {
  if (isInitialInfectionBoss(player)) return true;
  return !isCrossDistanceTarget(player, target);
}

function needsDistanceCostForTarget(player, card, target) {
  if (!player || !card || !target) return false;
  if (isInitialInfectionBoss(player)) return false;
  if (!isCrossDistanceTarget(player, target)) return false;
  if (player.equipment.weapon) return false;
  if (card.kind === 'utility' && card.element === 'water') return false;
  if (card.kind === 'normalAttack') return true;
  if (card.kind === 'statusAttack') return true;
  return false;
}

function leoOrderReceiverForTargets(player, targets) {
  if (!state || !player || !targets?.length) return null;
  return state.players.find(candidate =>
    candidate.characterId === 'leo' &&
    candidate.hp > 0 &&
    candidate.flags?.leoOrderTargetId === player.id &&
    targets.some(target => target.id === candidate.id)
  ) || null;
}

function targetsForCardPlay(player, card, targetId, targetIds = []) {
  if (!player || !card) return [];
  if (card.kind === 'aoe') {
    return enemiesOf(player).filter(enemy => enemy.hp > 0 && !player.flags?.iceArmorBlockedTargetIds?.includes(enemy.id));
  }
  const requestedIds = targetIds.length > 0 ? targetIds : [targetId];
  return [...new Set(requestedIds)]
    .map(id => state.players.find(candidate => candidate.id === id))
    .filter(Boolean);
}

function needsLeoOrderPayment(player, card, targets) {
  return Boolean(leoOrderReceiverForTargets(player, targets));
}

function leoOrderPaymentCandidates(player, reservedCardIds = []) {
  return player.hand.filter(card => !reservedCardIds.includes(card.id));
}

function beginLeoOrderPaymentDraft(player, card, targetId, extraCostCardId = '', selectedCardId = '', targetIds = []) {
  const targets = targetsForCardPlay(player, card, targetId, targetIds);
  const receiver = leoOrderReceiverForTargets(player, targets);
  if (!receiver) return false;
  const reservedCardIds = [card.id, extraCostCardId].filter(Boolean);
  const candidates = leoOrderPaymentCandidates(player, reservedCardIds);
  if (candidates.length === 0) {
    error = '兽王令要求先交给狮子 1 张牌，但当前没有可支付的手牌。';
    clearSelectedCard();
    render();
    return true;
  }
  leoOrderPaymentDraft = {
    playerId: player.id,
    cardId: card.id,
    targetId,
    extraCostCardId,
    selectedCardId,
    targetIds,
    receiverId: receiver.id,
    reservedCardIds
  };
  clearSelectedCard();
  render();
  return true;
}

function needsSkillDistanceCost(player, skillId, target) {
  if (!player || !target) return false;
  if (isInitialInfectionBoss(player)) return false;
  if (!isCrossDistanceTarget(player, target)) return false;
  if (player.equipment.weapon) return false;
  return ['aries.ram', 'capricorn.charge'].includes(skillId);
}

function distanceCostCandidates(player, cardOrDraft) {
  if (!player) return [];
  const reserved = new Set();
  if (cardOrDraft?.id) reserved.add(cardOrDraft.id);
  (cardOrDraft?.cardIds || []).forEach(id => reserved.add(id));
  return player.hand.filter(card => !reserved.has(card.id));
}

function waterStealTargets(target) {
  if (!target) return [];
  return target.hand.map((card, index) => ({
    id: card.id,
    label: '手牌 ' + (index + 1),
    detail: '卡背'
  }));
}

function needsWaterStealChoice(card, target) {
  return card?.kind === 'utility' && card.element === 'water' && waterStealTargets(target).length > 0;
}

function airDismantleTargets(target) {
  if (!target) return [];
  const handTargets = target.hand.map((card, index) => ({
    id: card.id,
    label: '手牌 ' + (index + 1),
    detail: '卡背'
  }));
  const equipmentTargets = [];
  if (target.equipment.weapon) {
    equipmentTargets.push({
      id: target.equipment.weapon.id,
      label: '武器',
      detail: target.equipment.weapon.name
    });
  }
  if (target.equipment.armor) {
    equipmentTargets.push({
      id: target.equipment.armor.id,
      label: '防具',
      detail: target.equipment.armor.name
    });
  }
  return [...handTargets, ...equipmentTargets];
}

function needsAirDismantleChoice(card, target) {
  return card?.kind === 'utility' && card.element === 'air' && airDismantleTargets(target).length > 0;
}

function canReleaseSelectedCardOnSeat(targetId) {
  const card = selectedCardObject();
  if (!card || card.kind === 'aoe') return false;
  return canDropCardOnSeat(selectedCard, targetId);
}

function canReleaseSkillCostOnSeat(playerId, targetId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === targetId);
  const draft = activeSkillCostDraft(player);
  if (!player || !target || !draft?.requiresTarget) return false;
  if (player.flags?.iceArmorBlockedTargetIds?.includes(target.id) && ['aries.ram','aries.burnSoul','leo.roar','scorpio.freezeAoe'].includes(draft.skillId)) return false;
  if (draft.skillId === 'leo.roar') {
    return draft.costCardIds.length === 1 && target.hp > 0 && !target.eliminated && target.id !== player.id;
  }
  if (!draft.ready) return false;
  if (draft.skillId === 'scorpio.freezeAoe') {
    return isSkillUsable(player, draft.skillId, !setupPaused) && target.id !== player.id && target.hp > 0 && !target.eliminated;
  }
  if (draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') {
    return target.hp > 0 && (state.mode === 'infection' ? target.id !== player.id : target.teamId !== player.teamId);
  }
  if (draft.skillId === 'leo.order') {
    return target.hp > 0 && target.id !== player.id;
  }
  if (draft.skillId === 'cancer.heal') return isSkillUsable(player, draft.skillId, !setupPaused) && canReceiveOrdinaryHealing(target);
  if (draft.skillId === 'virgo.purify') {
    return target.hp > 0 && !target.eliminated;
  }
  return false;
}

function releaseSkillCostOnSeat(playerId, targetId) {
  if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
  const player = state.players.find(candidate => candidate.id === playerId);
  if (activeSkillCostDraft(player)?.skillId === 'leo.roar') {
    return toggleLeoRoarTarget(playerId, targetId);
  }
  return confirmActiveSkillCost(playerId, targetId);
}

function isLeoRoarTargetSelected(playerId, targetId) {
  return Boolean(leoRoarDrafts[playerId]?.targetIds?.includes(targetId));
}

function toggleLeoRoarTarget(playerId, targetId) {
  if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = activeSkillCostDraft(player);
  if (!player || draft?.skillId !== 'leo.roar') return;
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 3
      ? [...selected, targetId]
      : selected;
  if (!selected.includes(targetId) && selected.length >= 3) {
    error = '狮吼最多选择 3 个目标；可先取消一个已选目标。';
  } else {
    error = '';
  }
  leoRoarDrafts[playerId] = { costCardIds: draft.costCardIds, targetIds };
  render();
}

function clearSelectedCard() {
  selectedCard = null;
  hideDragGuide();
  requestAnimationFrame(updatePersistentActionGuide);
}

function selectCardForTarget(playerId, cardId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const card = player?.hand.find(candidate => candidate.id === cardId);
  if (!player || !card) return;
  if (selectedCard?.playerId === playerId && selectedCard?.cardId === cardId && card.kind === 'aoe') {
    return releaseSelectedAoeCard();
  }
  selectedCard = { playerId, cardId, targetIds: [] };
  render();
  requestAnimationFrame(updatePersistentActionGuide);
}

function releaseSelectedCardOnSeat(targetId) {
  return window.TabletopV10.queueTarget(targetId);
}

function commitSelectedCardOnSeat(targetId) {
  if (!canReleaseSelectedCardOnSeat(targetId)) return;
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  const target = state.players.find(candidate => candidate.id === targetId);
  if (canBossBasicAttackAddTarget(player, card)) {
    const legalTargets = enemiesOf(player).filter(candidate => canDropCardOnSeat(selectedCard, candidate.id));
    if (legalTargets.length >= 2) {
      const chosenTargetIds = selectedCard?.targetIds || [];
      if (chosenTargetIds.includes(targetId)) {
        selectedCard = { ...selectedCard, targetIds: [] };
        render();
        requestAnimationFrame(updatePersistentActionGuide);
        return;
      }
      if (chosenTargetIds.length === 0) {
        selectedCard = { ...selectedCard, targetIds: [targetId] };
        render();
        requestAnimationFrame(updatePersistentActionGuide);
        return;
      }
      const targetIds = [chosenTargetIds[0], targetId];
      clearSelectedCard();
      return play(player.id, card, targetIds[0], '', '', '', targetIds);
    }
  }
  if (needsWaterStealChoice(card, target)) {
    waterStealDraft = { playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  if (needsDistanceCostForTarget(player, card, target)) {
    const candidates = distanceCostCandidates(player, card);
    if (candidates.length === 0) {
      error = '跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
      clearSelectedCard();
      render();
      return;
    }
    distanceCostDraft = { type: 'playCard', playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  if (needsAirDismantleChoice(card, target)) {
    airDismantleDraft = { playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  clearSelectedCard();
  return play(player.id, card, targetId);
}

function handleSeatEquipmentClick(playerId) {
  if (canReleaseSelectedCardOnSeat(playerId)) return releaseSelectedCardOnSeat(playerId);
  const active = state?.players.find(candidate => candidate.id === state.activePlayerId);
  if (active && canReleaseSkillCostOnSeat(active.id, playerId)) {
    return releaseSkillCostOnSeat(active.id, playerId);
  }
  return openPlayerInspector(playerId, 'equipment');
}

function releaseSelectedAoeCard() {
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  const targetId = targetIdsForSelectedCard()[0];
  if (!player || !card || !targetId) return;
  clearSelectedCard();
  return play(player.id, card, targetId);
}

function allowCardDrop(event, targetId) {
  if (!canDropCardOnSeat(draggedCard, targetId)) return;
  event.preventDefault();
  event.currentTarget.classList.add('dropReady');
  event.currentTarget.classList.add('dropTarget');
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  updateDragGuide(event);
}

function leaveCardDrop(event) {
  event.currentTarget.classList.remove('dropTarget');
}

function dropCardOnSeat(event, targetId) {
  event.preventDefault();
  event.currentTarget.classList.remove('dropTarget');
  let payload = draggedCard;
  if (!payload && event.dataTransfer) {
    try {
      payload = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch {
      payload = null;
    }
  }
  if (!canDropCardOnSeat(payload, targetId)) {
    clearCardDrag();
    return;
  }
  const player = state.players.find(candidate => candidate.id === payload.playerId);
  const card = player.hand.find(candidate => candidate.id === payload.cardId);
  clearCardDrag();
  return play(player.id, card, targetId);
}

function characterVisual(player) {
  const elementKey = CHARACTER_ELEMENTS[player.characterId] || 'fire';
  const element = ELEMENT_VISUALS[elementKey];
  const name = labels[player.characterId] || player.characterId;
  return {
    className: element.className,
    elementLabel: element.label,
    sigil: name.slice(0, 2),
    name
  };
}

function hpPips(player) {
  let output = '';
  for (let index = 0; index < player.maxHp; index += 1) {
    output += '<span class="pip ' + (index < player.hp ? 'filled' : '') + '"></span>';
  }
  return output;
}

function seatRelationLabel(player, perspective) {
  if (state?.mode === 'infection') {
    return perspective && player.factionId !== perspective.factionId ? '敌' : '友';
  }
  return perspective && player.teamId !== perspective.teamId ? '敌' : '友';
}

function miniHpDrops(player) {
  let output = '';
  for (let index = 0; index < player.maxHp; index += 1) {
    output += '<span class="hpDrop ' + (index < player.hp ? 'filled' : 'empty') + '"></span>';
  }
  return '<span class="hpDrops" aria-label="生命 ' + player.hp + '/' + player.maxHp + '">' + output + '</span>';
}

function armorShield(player) {
  const armor = Math.max(0, player.armor || 0);
  return '<span class="armorShield ' + (armor > 0 ? 'filled' : 'empty') + '" aria-label="护甲 ' + armor + '">' + armor + '</span>';
}

function statusIconSvg(statusId) {
  const labels = {
    clean: '无异常',
    burn: '灼烧',
    frozen: '冰冻',
    blind: '致盲',
    silence: '沉默',
    shield: '圣盾',
    abnormalImmunity: '异常免疫',
    sureHit: '必中',
    infection: '感染'
  };
  const label = labels[statusId] || statusId;
  const iconId = Object.hasOwn(labels,statusId) ? statusId : 'clean';
  return '<span class="statusIcon ' + safeText(statusId) + '" title="' + safeText(label) + '" aria-label="' + safeText(label) + '">' +
    '<img src="/zodiac-war-playtest/assets/ui-raster/status-' + iconId + '.png" alt="" aria-hidden="true">' +
  '</span>';
}

function renderStatusIcons(player) {
  const ids = Object.keys(player.statuses || {}).filter((statusId) => player.statuses?.[statusId]);
  if (player.infected) ids.push('infection');
  if (ids.length === 0) ids.push('clean');
  return '<span class="statusIcons">' + ids.map(statusIconSvg).join('') + '</span>';
}

function actionTimeoutTargetId() {
  if (!state || !actionDeadline || setupPaused) return '';
  if (state.phase === 'main') return state.activePlayerId;
  if (state.phase === 'response' && state.pendingAttack) return state.pendingAttack.currentTargetId;
  if (state.phase === 'infectionResponse') return state.infection?.pendingInfectionCard?.targetId || '';
  if (state.phase === 'rescue') return (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId || '';
  if (state.phase === 'reward') return state.infection?.pendingReward?.playerId || '';
  return '';
}

function timerProfileForPhase(phase) {
  if (phase === 'main') return { total: MAIN_TOTAL_SECONDS, idle: MAIN_IDLE_SECONDS };
  if (['response', 'infectionResponse', 'rescue', 'reward'].includes(phase)) {
    return { total: RESPONSE_TOTAL_SECONDS, idle: RESPONSE_IDLE_SECONDS };
  }
  return { total: 0, idle: 0 };
}

function effectiveRemainingSeconds(startedAt, phase) {
  const profile = timerProfileForPhase(phase);
  if (!startedAt || profile.total <= 0) return 0;
  const elapsed = Math.max(0, (Date.now() - startedAt) / 1000);
  if (elapsed <= profile.idle) return Math.ceil(Math.max(0, profile.total - elapsed));
  const acceleratedSpan = Math.max(0, profile.total - profile.idle - FINAL_NORMAL_SECONDS);
  const acceleratedElapsed = Math.min(acceleratedSpan, (elapsed - profile.idle) * TIMER_SPEEDUP);
  const remainingBeforeFinal = profile.total - profile.idle - acceleratedElapsed;
  if (remainingBeforeFinal > FINAL_NORMAL_SECONDS) return Math.ceil(remainingBeforeFinal);
  const finalStart = profile.idle + acceleratedSpan / TIMER_SPEEDUP;
  return Math.ceil(Math.max(0, FINAL_NORMAL_SECONDS - Math.max(0, elapsed - finalStart)));
}

function actionTimerRemainingSeconds() {
  if (!actionDeadline) return 0;
  return effectiveRemainingSeconds(actionStartedAt, state?.phase);
}

function renderActionCountdown(player) {
  if (actionTimeoutTargetId() !== player.id) return '';
  const remaining = actionTimerRemainingSeconds();
  if (remaining <= 0 || remaining > 3) return '';
  return '<div class="turnCountdownBadge countdownUrgent" data-countdown-player-id="' + player.id + '">' + remaining + '</div>';
}

function actionPrompt(active, activeOpponent, attackSource, defenseTarget) {
  if (!state) return '';
  const boardHint=boardSkillHint();
  if (boardHint) return boardHint;
  const skillDecision = state.pendingSkillDecisions?.[0];
  if (skillDecision) {
    if (sagittariusResupplySelection()) return '缪斯之弦：点击角色选择补牌目标，再点确定。';
    const owner = state.players.find(player => player.id === skillDecision.playerId);
    return (owner?.name || '角色') + ' 正在进行技能选择，请先完成上方选择。';
  }
  if (state.phase === 'gameOver' && !state.winnerTeamId) {
    const rescuer = aiRescueReviewPlayer() || rescueReviewPlayer();
    return rescuer
      ? rescuer.name + ' 正在进行急救复核，将使用太阳或星能急救。'
      : '正在完成胜负复核。';
  }
  if (state.phase === 'mulligan') return '开局换牌：所有角色有 8 秒同时确认；未操作默认保留起手牌。';
  if (state.phase === 'draw') return active.name + ' 回合开始后，摸牌阶段前：先处理回合开始技能，再摸牌。';
  if (state.phase === 'main') {
    const skillDraft = activeSkillCostDraft(active);
    if (skillDraft?.skillId === 'leo.roar') {
      if (!skillDraft.costCardIds.length) return '狮吼：先选择 1 张火牌作为费用，再选择 1–3 名其他存活角色。';
      const names = skillDraft.targetIds.map(id => state.players.find(player => player.id === id)?.name).filter(Boolean);
      return names.length ? '狮吼：已选 ' + names.join('、') + '（' + names.length + '/3），再次点击狮吼发动。' : '狮吼：点击 1–3 名其他存活角色，再次点击狮吼发动。';
    }
    if (selectedCardObject()?.kind === 'sun' && selectedCard?.playerId === active.id) {
      const targetNames = (selectedCard.targetIds || []).map(id => state.players.find(player => player.id === id)?.name).filter(Boolean);
      return '太阳回血：' + (targetNames.length ? '已选 ' + targetNames.join('、') + '，点击确认出牌。' : state.mode === 'infection' ? '请选择自己，再确认出牌。' : '请选择回血目标（可选自己），再确认出牌。');
    }
    return active.name + ' 的出牌阶段：当前指向敌方 ' + (activeOpponent?.name || '无') + '。';
  }
  if (state.phase === 'response') {
    const pending = state.pendingAttack;
    const hitText = pending && pending.hitsPerTarget > 1
      ? '（第 ' + (pending.hitsPerTarget - pending.hitsRemaining + 1) + '/' + pending.hitsPerTarget + ' 次打击）'
      : '';
    return (defenseTarget?.name || '目标') + ' 正在响应来自 ' + (attackSource?.name || '攻击者') + ' 的攻击' + hitText + '。';
  }
  if (state.phase === 'infectionResponse') {
    const pending = state.infection?.pendingInfectionCard;
    const source = state.players.find(player => player.id === pending?.sourceId);
    const target = state.players.find(player => player.id === pending?.targetId);
    return (target?.name || '目标') + ' 正在响应 ' + (source?.name || '感染者') + ' 的感染牌。';
  }
  if (state.phase === 'rescue') {
    const pending = (state.pendingRescue || state.infection?.pendingDying);
    const target = state.players.find(player => player.id === pending?.targetId);
    const responder = state.players.find(player => player.id === pending?.currentResponderId);
    const hasSun = responder?.hand.some(card => card.kind === 'sun' && canUseRescueCard(responder, card));
    const hasEnergy = responder?.hand.some(card => card.kind === 'energy' && canUseRescueCard(responder, card));
    const rescueName = hasSun ? (hasEnergy ? '太阳或星能' : '太阳') : hasEnergy ? '星能' : '';
    return (responder?.name || '角色') + (rescueName ? ' 可使用' + rescueName + '急救濒死的 ' : ' 正在选择是否急救濒死的 ') + (target?.name || '幸存者') + '。';
  }
  if (state.phase === 'reward') {
    const pending = state.infection?.pendingReward;
    const rewarded = state.players.find(player => player.id === pending?.playerId);
    return (rewarded?.name || '幸存者') + ' 正在选择击杀感染者奖励。';
  }
  if (state.phase === 'hammerBreak') return (defenseTarget?.name || '防御者') + ' 需为撼岳锤额外交出 1 张手牌，否则本次防御无效。';
  if (state.phase === 'discard') return active.name + ' 的弃牌阶段：将手牌弃至体力值。';
  return active.name + ' 正在行动。';
}

function deriveLatestEffect() {
  if (!state || !previousState) return null;
  const damage = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.hp >= before.hp) return null;
      return { targetId: player.id, amount: before.hp - player.hp };
    })
    .find(Boolean);
  if (damage) {
    return {
      sourceId: previousState.pendingAttack?.sourceId || state.pendingAttack?.sourceId || previousState.activePlayerId || state.activePlayerId,
      targetId: damage.targetId,
      text: '-' + damage.amount,
      kind: 'damage',
      at: Date.now()
    };
  }
  const healing = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.hp <= before.hp) return null;
      return { targetId: player.id, amount: player.hp - before.hp };
    })
    .find(Boolean);
  if (healing) {
    return {
      sourceId: previousState.activePlayerId || state.activePlayerId,
      targetId: healing.targetId,
      text: '+' + healing.amount,
      kind: 'heal',
      at: Date.now()
    };
  }
  const armorChange = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.armor === before.armor) return null;
      return { targetId: player.id, amount: Math.abs(player.armor - before.armor), gained: player.armor > before.armor };
    })
    .find(Boolean);
  if (armorChange) {
    return {
      sourceId: previousState.activePlayerId || state.activePlayerId,
      targetId: armorChange.targetId,
      text: armorChange.gained ? '+' + armorChange.amount + ' 护甲' : '护甲吸收 ' + armorChange.amount,
      kind: armorChange.gained ? 'armorGain' : 'armorBlock',
      at: Date.now()
    };
  }
  const previousAttack = previousState.pendingAttack;
  if (previousAttack && (!state.pendingAttack || state.phase !== previousState.phase)) {
    return {
      sourceId: previousAttack.sourceId,
      targetId: previousAttack.currentTargetId,
      text: '防御',
      kind: 'defense',
      at: Date.now()
    };
  }
  return null;
}

function playHitSound() {
  try {
    hitAudioContext = window.ZodiacAudio?.context();
    if (!hitAudioContext) return;
    const audio = hitAudioContext;
    const output = window.ZodiacAudio.effectsOutput('damage');
    const now = audio.currentTime;
    const sampleCount = Math.max(1, Math.floor(audio.sampleRate * 0.055));
    const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < sampleCount; index += 1) {
      const fade = 1 - index / sampleCount;
      samples[index] = (Math.random() * 2 - 1) * fade;
    }
    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    noise.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(0.8, now);
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noise.start(now);
    noise.stop(now + 0.06);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(72, now + 0.07);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(now);
    oscillator.stop(now + 0.11);
  } catch (_error) {
    // Audio is feedback only; browser autoplay limits must not block game flow.
  }
}

function playPositiveEffectSound(kind) {
  try {
    hitAudioContext = window.ZodiacAudio?.context();
    if (!hitAudioContext) return;
    const audio = hitAudioContext;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = kind === 'heal' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(kind === 'heal' ? 420 : 240, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'heal' ? 720 : 360, now + 0.13);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
    oscillator.connect(gain);
    gain.connect(window.ZodiacAudio.effectsOutput(kind));
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  } catch (_error) {
    // Audio is feedback only; browser autoplay limits must not block game flow.
  }
}

function playLatestEffectSound() {
  if (!latestEffect || !['damage', 'heal', 'armorGain', 'armorBlock'].includes(latestEffect.kind)) return;
  const key = [latestEffect.targetId, latestEffect.text, latestEffect.at].join(':');
  if (key === lastHitSoundKey) return;
  lastHitSoundKey = key;
  if (latestEffect.kind === 'damage') playHitSound();
  else playPositiveEffectSound(latestEffect.kind);
}

function effectFeedbackFor(player) {
  if (!latestEffect || latestEffect.targetId !== player.id) return { className: '', markup: '' };
  if (latestEffect.kind === 'damage') {
    return {
      className: ' damageHit',
      markup: '<div class="damageFlash"></div><div class="slashMark"></div><div class="floatText damageText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  if (latestEffect.kind === 'heal') {
    return {
      className: ' healHit',
      markup: '<div class="healFlash"></div><div class="healPulseMark"></div><div class="floatText healText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  if (latestEffect.kind === 'armorGain' || latestEffect.kind === 'armorBlock') {
    return {
      className: ' armorHit',
      markup: '<div class="armorFlash"></div><div class="armorPulseMark">盾</div><div class="floatText armorText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  return { className: '', markup: '' };
}

function targetIdsForDisplay(display) {
  if (!display) return [];
  if (Array.isArray(display.targetIds) && display.targetIds.length > 0) return display.targetIds;
  return display.targetId ? [display.targetId] : [];
}

function currentActionGuide() {
  if (!state || setupPaused || lobbyOpen || state.phase === 'mulligan' || state.phase === 'gameOver') return null;
  if (sagittariusResupplySelection()) return null;
  if (boardSkillSelection()) return null;
  const selected = selectedCardObject();
  const selectedTargets = selected?.kind === 'aoe' ? targetIdsForSelectedCard() : (selectedCard?.targetIds || []);
  if (selected && selectedTargets.length > 0) {
    return {
      sourceId: selectedCard.playerId,
      targetIds: selectedTargets,
      isAoe: selected.kind === 'aoe' || selectedTargets.length > 1,
      preview: true
    };
  }
  const displays = state?.playedCards?.cards || [];
  const played = [...displays].reverse().find(display => targetIdsForDisplay(display).length > 0);
  if (played) {
    if (!state.pendingAttack && !state.infection?.pendingInfectionCard) {
      const key = played.playerId + ':' + played.card.id + ':' + targetIdsForDisplay(played).join(',');
      const ui = window.TabletopV10;
      if (ui.resolutionKey !== key) {
        ui.resolutionKey = key;
        ui.resolutionUntil = Date.now() + 1800;
        clearTimeout(ui.resolutionTimer);
        ui.resolutionTimer = setTimeout(updatePersistentActionGuide, 1810);
      }
      if (Date.now() > ui.resolutionUntil) return null;
    }
    return {
      sourceId: played.playerId,
      targetIds: targetIdsForDisplay(played),
      isAoe: played.card.kind === 'aoe'
    };
  }
  if (state?.pendingAttack) {
    const pendingTargets = state.pendingAttack.card.kind === 'aoe'
      ? state.pendingAttack.targetIds
      : [state.pendingAttack.currentTargetId];
    return {
      sourceId: state.pendingAttack.sourceId,
      targetIds: pendingTargets,
      isAoe: state.pendingAttack.card.kind === 'aoe'
    };
  }
  if (state?.infection?.pendingInfectionCard) {
    return {
      sourceId: state.infection.pendingInfectionCard.sourceId,
      targetIds: [state.infection.pendingInfectionCard.targetId],
      isAoe: false
    };
  }
  if (latestEffect?.kind === 'damage' && latestEffect?.sourceId && latestEffect?.targetId) {
    return { sourceId: latestEffect.sourceId, targetIds: [latestEffect.targetId], fromCenter: false, isAoe: false };
  }
  return null;
}

function quadraticPath(x1, y1, x2, y2, offset) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.max(1, Math.hypot(dx, dy));
  const curveX = midX - (dy / length) * offset;
  const curveY = midY + (dx / length) * offset;
  return 'M ' + x1 + ' ' + y1 + ' Q ' + curveX + ' ' + curveY + ' ' + x2 + ' ' + y2;
}

function rectCenter(rect, base) {
  return {
    x: rect.left + rect.width / 2 - base.left,
    y: rect.top + rect.height / 2 - base.top
  };
}

function rectEdgePoint(rect, towardX, towardY, base) {
  const center = rectCenter(rect, base);
  const dx = towardX - center.x;
  const dy = towardY - center.y;
  if (dx === 0 && dy === 0) return center;
  const halfWidth = Math.max(1, rect.width / 2);
  const halfHeight = Math.max(1, rect.height / 2);
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);
  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale
  };
}

function playerGuideElement(playerId) {
  return document.querySelector(
    '.seatCard[data-player-id="' + playerId + '"], .stageFocusCard[data-player-id="' + playerId + '"]'
  );
}

function updatePersistentActionGuide() {
  const layer = document.getElementById('actionGuideLayer');
  const beamGroup = document.getElementById('actionGuideBeams');
  if (!layer || !beamGroup) return;
  document.querySelectorAll('.seatCard.guideTarget').forEach(card => card.classList.remove('guideTarget'));
  beamGroup.replaceChildren();
  const guide = currentActionGuide();
  if (!guide) {
    layer.classList.remove('active');
    return;
  }
  const originSelector = guide.preview ? '.card.selectedCard' : '.playedCardDisplay.actionOrigin';
  const source = document.querySelector(originSelector + '[data-player-id="' + guide.sourceId + '"]') || playerGuideElement(guide.sourceId);
  const targets = guide.targetIds
    .filter(targetId => targetId !== guide.sourceId)
    .map(targetId => playerGuideElement(targetId))
    .filter(Boolean);
  if (!source || targets.length === 0) {
    layer.classList.remove('active');
    return;
  }
  const base = layer.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const sourceCenter = rectCenter(sourceRect, base);
  const compact = window.matchMedia('(max-width: 1180px), (max-height: 600px)').matches;
  const beamHeight = compact ? (guide.isAoe ? 10 : 12) : (guide.isAoe ? 18 : 20);
  targets.forEach(target => {
    target.classList.add('guideTarget');
    const targetRect = target.getBoundingClientRect();
    const targetCenter = rectCenter(targetRect, base);
    const sourcePoint = rectEdgePoint(sourceRect, targetCenter.x, targetCenter.y, base);
    const targetPoint = rectEdgePoint(targetRect, sourceCenter.x, sourceCenter.y, base);
    const x1 = sourcePoint.x;
    const y1 = sourcePoint.y;
    const x2 = targetPoint.x;
    const y2 = targetPoint.y;
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.max(1, Math.hypot(deltaX, deltaY));
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    const beam = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    beam.setAttribute('href', '/zodiac-war-playtest/assets/ui/action-guide-meteor-v11.webp');
    beam.setAttribute('x', String(x1));
    beam.setAttribute('y', String(y1 - beamHeight / 2));
    beam.setAttribute('width', String(distance));
    beam.setAttribute('height', String(beamHeight));
    beam.setAttribute('preserveAspectRatio', 'none');
    beam.setAttribute('transform', 'rotate(' + angle + ' ' + x1 + ' ' + y1 + ')');
    beam.setAttribute('class', 'actionGuideBeamSprite' + (guide.isAoe ? ' aoe' : '') + (guide.preview ? ' preview' : ''));
    beamGroup.append(beam);
  });
  layer.classList.add('active');
}

function renderCombatant(player, roleLabel) {
  if (!player) return '<article class="combatant empty"><strong>暂无目标</strong></article>';
  const visual = characterVisual(player);
  const feedback = effectFeedbackFor(player);
  return '<article class="combatant ' + visual.className + feedback.className + '">' +
    '<div class="combatantTitle"><div><strong>' + safeText(player.name) + ' · ' + safeText(visual.name) + '</strong><small>' + safeText(roleLabel) + ' / ' + safeText(visual.elementLabel) + '象</small></div><span class="statPill">' + safeText(player.teamId) + '队</span></div>' +
    '<div class="portraitSigil">' + safeText(visual.sigil) + '</div>' +
    '<div class="combatStats">' +
    '<div class="hpPips">' + hpPips(player) + '</div>' +
    '<div class="statRow"><span class="statPill">生命 ' + player.hp + '/' + player.maxHp + '</span><span class="statPill">护甲 ' + player.armor + '</span><span class="statPill">怒气 ' + player.rage + '</span><span class="statPill">状态 ' + safeText(statuses(player)) + '</span></div>' +
    '</div>' +
    feedback.markup +
  '</article>';
}

function actionOrderIndex(player) {
  if (!setupFateDrawn || !state?.startingPlayerId) return null;
  const seats = [...state.players].sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const startIndex = seats.findIndex((candidate) => candidate.id === state.startingPlayerId);
  const playerIndex = seats.findIndex((candidate) => candidate.id === player.id);
  if (startIndex < 0 || playerIndex < 0) return null;
  const direction = state.turnDirection === -1 ? -1 : 1;
  return ((playerIndex - startIndex) * direction + seats.length) % seats.length;
}

function actionOrderBadge(player) {
  const orderIndex = actionOrderIndex(player);
  return orderIndex === null
    ? ''
    : '<span class="seatPosition" title="本局行动顺序">' + (orderIndex + 1) + '</span>';
}

function actionOrderLabel(player) {
  const orderIndex = actionOrderIndex(player);
  return orderIndex === null ? '' : (orderIndex + 1) + '号行动 · ';
}

function renderSeatCard(player, active, perspective) {
  const visual = characterVisual(player);
  const portrait = assetImageHtml('characterArt', characterAssetUrls(player.characterId), visual.name);
  const selectedEnemy = active ? selectedEnemyOf(active) : null;
  const selectedAoeTargetIds = targetIdsForSelectedCard();
  const canReleaseSelected = canReleaseSelectedCardOnSeat(player.id);
  const canReleaseSkillCost = active ? canReleaseSkillCostOnSeat(active.id, player.id) : false;
  const isSelectedLeoRoarTarget = active ? isLeoRoarTargetSelected(active.id, player.id) : false;
  const isSelectedAoeTarget = selectedAoeTargetIds.includes(player.id);
  const canPickEnemy = active && state.phase === 'main' &&
    (state.mode === 'infection' ? player.id !== active.id : player.teamId !== active.teamId) &&
    player.hp > 0 && !player.eliminated;
  const relationLabel = seatRelationLabel(player, perspective || active);
  const relationClass = relationLabel === '敌' ? 'enemy' : 'friend';
  const feedback = effectFeedbackFor(player);
  const classes = [
    'seatCard',
    visual.className,
    portrait ? 'hasCharacterArt' : '',
    player.hp <= 0 || player.eliminated ? 'dead' : '',
    player.factionId === 'infected' ? 'infectedFaction' : '',
    player.infected ? 'latentInfection' : '',
    player.infectionRole === 'converted' ? 'convertedInfected' : '',
    feedback.className.trim(),
    player.flags.energyChargeElement ? 'energyBoost' : '',
    state.activePlayerId === player.id ? 'current' : '',
    selectedEnemy?.id === player.id ? 'target' : '',
    state.pendingAttack?.sourceId === player.id ? 'source' : '',
    state.pendingAttack?.currentTargetId === player.id ? 'defense' : '',
    canReleaseSkillCost || canReleaseSelected || isSelectedAoeTarget ? 'selectedCardTarget' : '',
    isSelectedLeoRoarTarget ? 'multiSkillTargetSelected' : '',
    canReleaseSkillCost || canReleaseSelected || canPickEnemy ? 'clickable' : ''
  ].filter(Boolean).join(' ');
  const click = canReleaseSkillCost
    ? ' onclick="releaseSkillCostOnSeat(\'' + active.id + '\', \'' + player.id + '\')"'
    : canReleaseSelected
      ? ' onclick="releaseSelectedCardOnSeat(\'' + player.id + '\')"'
      : canPickEnemy ? ' onclick="setTarget(\'' + active.id + '\', \'enemy\', \'' + player.id + '\')"' : '';
  const dropAttrs = ' ondragover="allowCardDrop(event, \'' + player.id + '\')" ondragenter="allowCardDrop(event, \'' + player.id + '\')" ondragleave="leaveCardDrop(event)" ondrop="dropCardOnSeat(event, \'' + player.id + '\')"';
  const ragePill = shouldShowRage(player) ? '<span class="statPill">怒气 ' + player.rage + '</span>' : '';
  const infectionIdentity = state.mode === 'infection'
    ? '<div class="infectionIdentity">' +
        '<span class="statPill">' + (player.factionId === 'infected' ? '感染阵营' : '幸存者') + '</span>' +
        (player.infectionRole === 'initial' ? '<span class="statPill bossMark">初始感染者</span>' : '') +
        (player.infectionRole === 'converted' ? '<span class="statPill convertedMark">转化感染者</span>' : '') +
        (player.infected ? '<span class="statPill latentMark">感染</span>' : '') +
        (player.eliminated ? '<span class="statPill">永久出局</span>' : '') +
      '</div>'
    : '';
  return '<article class="' + classes + '" data-player-id="' + safeText(player.id) + '" aria-disabled="' + (player.hp <= 0 || player.eliminated ? 'true' : 'false') + '"' + click + dropAttrs + '>' +
    portrait +
    '<div class="seatCardName"><span class="seatRelation ' + relationClass + '">' + relationLabel + '</span>' + actionOrderBadge(player) + '<span class="seatZodiacName">' + safeText(visual.name) + '</span><span class="seatVitalIcons">' + miniHpDrops(player) + armorShield(player) + '</span></div>' +
    '<div class="seatCardRole">' + safeText(player.control === 'ai' ? 'AI 托管' : '真人操作') + ' · ' + safeText(visual.elementLabel) + '象</div>' +
    infectionIdentity +
    '<div class="seatSigil">' + safeText(visual.sigil) + '</div>' +
    '<div class="seatStats">' +
      (ragePill ? '<div class="statRow">' + ragePill + '</div>' : '') +
      '<div class="statRow"><span class="statPill statusPill">' + renderStatusIcons(player) + '</span><span class="statPill">手牌 ' + player.hand.length + '</span></div>' +
      '<div class="statRow"><button class="seatEquipmentButton weapon" onclick="event.stopPropagation(); handleSeatEquipmentClick(\'' + player.id + '\')">武器 ' + safeText(player.equipment.weapon?.name || '无') + '</button><button class="seatEquipmentButton armor" onclick="event.stopPropagation(); handleSeatEquipmentClick(\'' + player.id + '\')">防具 ' + safeText(player.equipment.armor?.name || '无') + '</button></div>' +
      '<div class="seatSkillList">' + characterSkillEntries(player).map(item =>
        '<button onclick="event.stopPropagation(); showSeatSkillTip(\'' + player.id + '\', \'' + item.id + '\', event)">' + safeText(item.label) + '</button>'
      ).join('') + '</div>' +
    '</div>' +
    feedback.markup +
    renderActionCountdown(player) +
  '</article>';
}

function renderStageLogPanel() {
  return '<details class="stageLogPanel" id="logPanel"' + (stageLogOpen ? ' open' : '') + ' ontoggle="stageLogOpen = this.open">' +
    '<summary><span>对局日志</span><small id="logSummary">暂无日志</small></summary>' +
    '<div id="log"></div>' +
    '</details>';
}

function localizedLogMessage(event) {
  return window.GameI18n ? window.GameI18n.log(event, formatLogMessage) : formatLogMessage(event.message);
}

function formatLogMessage(message) {
  let formatted = String(message || '');
  const playersByNameLength = [...state.players].sort((left, right) => right.name.length - left.name.length);
  for (const player of playersByNameLength) {
    if (!player.name) continue;
    const zodiacName = labels[player.characterId] || player.characterId;
    formatted = formatted.split(player.name).join(zodiacName);
    formatted = formatted.split(zodiacName + '（' + zodiacName + '）').join(zodiacName);
  }
  return formatted;
}

function characterSkillEntries(player) {
  const map = {
    aries: [['aries.bloodRage', '金绒战意'], ['aries.ram', '金角冲'], ['aries.burnSoul', '燃魂']],
    leo: [['leo.aura', '狮威'], ['leo.roar', '狮吼'], ['leo.order', '兽王令']],
    gemini: [['gemini.windForm', '双生'], ['gemini.steal', '换影'], ['gemini.extraTurn', '连星']],
    libra: [['libra.elementSense', '衡感'], ['libra.judgment', '审判'], ['libra.harmony', '裁衡']],
    aquarius: [['aquarius.stormEye', '倾杯'], ['aquarius.massHeal', '神酿'], ['aquarius.windCut', '断流']],
    cancer: [['cancer.tideBond', '共潮'], ['cancer.heal', '疗潮'], ['cancer.rescue', '赫拉之护']],
    scorpio: [['scorpio.freezeAoe', '蝎毒'], ['scorpio.spoils', '缴械'], ['scorpio.peek', '窥星']],
    pisces: [['pisces.observeTide', '观潮'], ['pisces.balance', '双鱼之绊'], ['pisces.dream', '归潮']],
    taurus: [['taurus.guard', '护渡'], ['taurus.thickSkin', '神躯'], ['taurus.armor', '筑甲']],
    capricorn: [['capricorn.unyielding', '牧神怒'], ['capricorn.wushuang', '重压'], ['capricorn.charge', '山崩']],
    sagittarius: [['sagittarius.bowcraft', '整弓'], ['sagittarius.seekEquipment', '寻器'], ['sagittarius.sharpshot', '缪斯之弦']],
    virgo: [['virgo.purify', '净化'], ['virgo.domain', '净域'], ['virgo.discipline', '星律']]
  };
  const bossSkills = isInitialInfectionBoss(player)
    ? [['infection.bossDrain', '月蚀汲取'], ['infection.bossCommand', '蚀月战令'], ['infection.bossNoDistance', '月蚀领域']]
    : [];
  return [...(map[player.characterId] || []), ...bossSkills].map(([id, label]) => ({
    id,
    label: skillDescriptions[id]?.name || label,
    description: skillDescriptions[id]?.summary || skillDescriptions[id]?.text || '该技能尚未配置介绍。'
  }));
}

const skillRulesOpen = {};

function renderSkillCopy(skillId, expanded = false, compact = false) {
  const item = skillDescriptions[skillId];
  if (!item) return '';
  if (!item.summary) return '<p class="skillCopySummary">' + safeText(item.text) + '</p>';
  const details = [...item.details];
  if (item.text.includes('基础攻击')) details.push('基础攻击指普通攻击和状态攻击，不含AOE。');
  return '<div class="skillCopy"><small class="skillCopyTag">' + safeText(item.tag) + '</small>' +
    '<p class="skillCopySummary">' + safeText(item.summary) + '</p>' +
    (compact || !details.length ? '' : '<details class="skillCopyDetails" data-skill-rules="' + safeText(skillId) + '"' +
      (expanded || skillRulesOpen[skillId] ? ' open' : '') + ' ontoggle="skillRulesOpen[this.dataset.skillRules]=this.open">' +
      '<summary>必要细则</summary>' + details.map(text => '<p>' + safeText(text) + '</p>').join('') + '</details>') + '</div>';
}

function showSeatSkillTip(playerId, skillId, event, preferredPlacement = '') {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const item = player ? characterSkillEntries(player).find(candidate => candidate.id === skillId) : null;
  if (!item) return;
  const rect = event?.currentTarget?.getBoundingClientRect?.();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1200;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
  const halfWidth = Math.min(180, Math.max(120, (viewportWidth - 20) / 2));
  const anchorX = rect ? rect.left + rect.width / 2 : viewportWidth / 2;
  const above = Boolean(rect && rect.top > 150);
  let x = Math.max(halfWidth + 10, Math.min(viewportWidth - halfWidth - 10, anchorX));
  let y = above ? rect.top - 8 : (rect?.bottom || 80) + 8;
  let placement = above ? 'above' : 'below';
  let width = Math.min(360, viewportWidth - 20);
  if (preferredPlacement === 'right' && rect) {
    const rightSpace = viewportWidth - rect.right - 10;
    const leftSpace = rect.left - 10;
    const placeRight = rightSpace >= 150 || rightSpace >= leftSpace;
    placement = placeRight ? 'right' : 'left';
    width = Math.min(240, Math.max(140, (placeRight ? rightSpace : leftSpace) - 8));
    x = placeRight ? rect.right + 8 : rect.left - 8;
    y = Math.max(64, Math.min(viewportHeight - 64, rect.top + rect.height / 2));
  }
  seatSkillTip = {
    playerId,
    skillId,
    label: item.label,
    description: item.description,
    x,
    y,
    width,
    placement
  };
  if (seatSkillTipTimer) clearTimeout(seatSkillTipTimer);
  render();
  seatSkillTipTimer = setTimeout(() => {
    seatSkillTip = null;
    seatSkillTipTimer = null;
    render();
  }, 3200);
}

function renderSeatSkillTip() {
  if (!seatSkillTip) return '';
  const player = state?.players.find(candidate => candidate.id === seatSkillTip.playerId);
  const senseHint = seatSkillTip.skillId === 'libra.elementSense' && player
    ? (state.activePlayerId === player.id
      ? '本轮衡感已记录：' + new Set(player.flags.libraRoundElements).size + '/4'
      : '回合外防御不触发衡感，也不占用属性资格。')
    : '';
  return '<aside class="seatSkillPopover ' + seatSkillTip.placement + '" style="left:' + Math.round(seatSkillTip.x) + 'px;top:' + Math.round(seatSkillTip.y) + 'px;width:' + Math.round(seatSkillTip.width || 360) + 'px" role="status">' +
    '<strong>' + safeText(seatSkillTip.label) + '</strong>' +
    renderSkillCopy(seatSkillTip.skillId, false, true) +
    '<button type="button" onclick="openPlayerInspector(\'' + seatSkillTip.playerId + '\')">查看细则</button>' +
    (senseHint ? '<span class="skillHint">' + safeText(senseHint) + '</span>' : '') +
  '</aside>';
}

function openPlayerInspector(playerId, section = 'skills') {
  if (seatSkillTipTimer) clearTimeout(seatSkillTipTimer);
  seatSkillTip = null;
  inspectedPlayerId = playerId;
  inspectedSection = section === 'equipment' ? 'equipment' : 'skills';
  render();
}

function closePlayerInspector() {
  inspectedPlayerId = '';
  render();
}

function canActivateEquipmentSkill(player, skillId) {
  if (state.pendingSkillDecisions?.length) return false;
  if (!player || player.id !== localHumanPlayer()?.id || setupPaused || state.activePlayerId !== player.id || state.phase !== 'main' || player.statuses?.silence) return false;
  if (skillId === 'weapon.waterCodex') {
    return player.equipment.weapon?.element === 'water' && !player.flags.usedWeaponConvert && player.hand.length >= 2;
  }
  if (skillId === 'weapon.airCompass') {
    return player.equipment.weapon?.element === 'air' && !player.flags.usedWindCompass && new Set(player.flags.usedCardElements).size >= 2 && state.deck.some(card => card.element);
  }
  return false;
}

function renderPlayerInspector() {
  const player = state?.players.find(candidate => candidate.id === inspectedPlayerId);
  if (!player) return '';
  const visual = characterVisual(player);
  const skillItems = characterSkillEntries(player).map(item =>
    '<article class="playerInspectorItem"><strong>' + safeText(item.label) + '</strong>' + renderSkillCopy(item.id) +
    (player.id === localHumanPlayer()?.id && !infoOnlySkills.has(item.id)
      ? '<button class="v10-inspector-action" ' + (!setupPaused && player.control === 'human' && isSkillUsable(player, item.id, state.activePlayerId === player.id && state.phase === 'main') ? '' : 'disabled') +
        ' onclick="inspectedPlayerId=\'\';skill(state.players.find(p=>p.id===\'' + player.id + '\'),\'' + item.id + '\',event)">发动' + safeText(item.label) + '</button>'
      : '') + '</article>'
  ).join('');
  const weaponActionId = player.equipment.weapon?.element === 'water'
    ? 'weapon.waterCodex'
    : player.equipment.weapon?.element === 'air'
      ? 'weapon.airCompass'
      : '';
  const weaponAction = weaponActionId
    ? '<button class="inspectorEquipmentAction" ' + (canActivateEquipmentSkill(player, weaponActionId) ? '' : 'disabled') +
      ' onclick="beginEquipmentAction(\'' + player.id + '\', \'' + weaponActionId + '\')">发动' + safeText(player.equipment.weapon?.name || '武器') + '</button>'
    : '';
  const equipmentItems =
    '<article class="playerInspectorItem equipmentDetail"><strong>武器 · ' + safeText(player.equipment.weapon?.name || '无') + '</strong><span>' + safeText(equipmentEffectText(player.equipment.weapon)) + '</span>' +
    (player.equipment.weapon ? '<small>' + safeText(window.TabletopV10.equipmentReason(player, weaponActionId)) + '</small>' : '') + weaponAction + '</article>' +
    '<article class="playerInspectorItem equipmentDetail"><strong>防具 · ' + safeText(player.equipment.armor?.name || '无') + '</strong><span>' + safeText(equipmentEffectText(player.equipment.armor)) + '</span></article>';
  return '<div class="playerInspectorBackdrop" onclick="closePlayerInspector()">' +
    '<aside class="playerInspectorPanel" role="dialog" aria-modal="true" aria-label="角色资料" onclick="event.stopPropagation()">' +
      '<header><div><small>' + safeText(player.name) + '</small><strong>' + safeText(visual.name) + '</strong></div><button class="inspectorClose" onclick="closePlayerInspector()" aria-label="关闭">×</button></header>' +
      '<div class="playerInspectorSummary"><span>' + miniHpDrops(player) + '</span><span>' + armorShield(player) + '</span><span>手牌 ' + player.hand.length + '</span><span>' + renderStatusIcons(player) + '</span></div>' +
      '<nav><button class="' + (inspectedSection === 'skills' ? 'selected' : '') + '" onclick="openPlayerInspector(\'' + player.id + '\', \'skills\')">星座技能</button><button class="' + (inspectedSection === 'equipment' ? 'selected' : '') + '" onclick="openPlayerInspector(\'' + player.id + '\', \'equipment\')">装备效果</button></nav>' +
      '<div class="playerInspectorContent">' + (inspectedSection === 'equipment' ? equipmentItems : skillItems) + '</div>' +
    '</aside>' +
  '</div>';
}

function renderSeatRail(side, active, perspective) {
  const seatOrder = [...state.players].sort((left, right) => left.seatIndex - right.seatIndex);
  const splitIndex = Math.ceil(seatOrder.length / 2);
  const players = side === 'left'
    ? seatOrder.slice(0, splitIndex).reverse()
    : seatOrder.slice(splitIndex);
  const title = side === 'left' ? '圆桌左席' : '圆桌右席';
  const playerCards = players
    .map(player => renderSeatCard(player, active, perspective || active))
    .join('');
  return '<div class="teamRail seatRail ' + side + 'SeatRail" style="--seat-count:' + Math.max(players.length, 1) + '">' +
    '<div class="teamRailTitle"><span>' + title + '</span><span>' + players.filter(player => player.hp > 0 && !player.eliminated).length + '/' + players.length + '</span></div>' +
    playerCards +
    '</div>';
}

function renderTableSeatRing(active, perspective) {
  const seatOrder = [...state.players].sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const focus = perspective || active || seatOrder[0];
  const focusIndex = Math.max(0, seatOrder.findIndex(player => player.id === focus?.id));
  const slotMap = seatOrder.length <= 4
    ? ['leftLower', 'leftUpper', 'rightUpper']
    : ['rightLower', 'rightUpper', 'topCenter', 'leftUpper', 'leftLower'];
  const seats = seatOrder
    .filter(player => player.id !== focus?.id)
    .map(player => {
      const playerIndex = seatOrder.findIndex(candidate => candidate.id === player.id);
      const relativeIndex = (playerIndex - focusIndex + seatOrder.length) % seatOrder.length;
      const slot = slotMap[Math.max(0, relativeIndex - 1)] || 'topCenter';
      return '<div class="ringSeat ringSeat-' + slot + '">' + renderSeatCard(player, active, focus) + '</div>';
    })
    .join('');
  return '<div class="tableSeatRing" aria-label="圆桌座位">' + seats + '</div>';
}

function renderFocusedSkillActions(player) {
  if (!player) return '';
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  return '<nav class="focusActionRail" aria-label="当前角色技能与装备技能">' +
    skillButtons(player, canAct) + equipmentTraitButtons(player) +
  '</nav>';
}

function renderFocusCard(player) {
  if (!player) return '<aside class="stageFocusCard"><strong>暂无当前角色</strong></aside>';
  const visual = characterVisual(player);
  const portrait = assetImageHtml('characterArt', characterAssetUrls(player.characterId), visual.name);
  const canReleaseSelected = canReleaseSelectedCardOnSeat(player.id);
  const active = state.players.find(candidate => candidate.id === state.activePlayerId);
  const canReleaseSkillCost = active ? canReleaseSkillCostOnSeat(active.id, player.id) : false;
  const feedback = effectFeedbackFor(player);
  const rageMeta = shouldShowRage(player) ? '<span>怒气 ' + player.rage + '</span>' : '';
  const infectionMeta = state.mode === 'infection'
    ? '<span>' + (player.factionId === 'infected' ? '感染阵营' : '幸存者') + '</span>' +
      (player.infected ? '<span>感染</span>' : '') +
      (player.infectionRole === 'initial' ? '<span>初始感染者</span>' : '') +
      (player.infectionRole === 'converted' ? '<span>转化感染者</span>' : '')
    : '';
  const equipmentButton = (slot, label, card) =>
    '<button class="equipmentButton" ' +
    (card ? 'onclick="selectEquipmentInfo(\'' + player.id + '\', \'' + slot + '\')"' : 'disabled') + '>' +
    safeText(label + '：' + (card?.name || '无')) +
    '</button>';
  const click = canReleaseSkillCost
    ? ' onclick="releaseSkillCostOnSeat(\'' + active.id + '\', \'' + player.id + '\')"'
    : canReleaseSelected ? ' onclick="releaseSelectedCardOnSeat(\'' + player.id + '\')"' : '';
  const dropAttrs = ' ondragover="allowCardDrop(event, \'' + player.id + '\')" ondragenter="allowCardDrop(event, \'' + player.id + '\')" ondragleave="leaveCardDrop(event)" ondrop="dropCardOnSeat(event, \'' + player.id + '\')"';
  return '<aside class="stageFocusCard ' + (portrait ? 'hasCharacterArt ' : '') + (player.hp <= 0 ? 'dead' : '') + ' ' + (player.flags.energyChargeElement ? 'energyBoost' : '') + feedback.className + (canReleaseSelected || canReleaseSkillCost ? ' selectedCardTarget clickable' : '') + '" data-player-id="' + safeText(player.id) + '"' + click + dropAttrs + '>' +
    portrait +
    '<div class="focusCardHeader">' +
      '<div class="focusCardName"><div class="focusNameLine">' + (actionOrderIndex(player) === null ? '' : '<span class="focusSeatPosition">' + actionOrderLabel(player).replace(' · ', '') + '</span>') + '<strong>' + safeText(visual.name) + '</strong><span class="focusVitalIcons">' + miniHpDrops(player) + armorShield(player) + '</span></div><small>' + safeText(player.control === 'ai' ? 'AI 托管' : '真人操作') + ' · ' + safeText(visual.elementLabel) + '象</small></div>' +
      '<div class="seatSigil">' + safeText(visual.sigil) + '</div>' +
    '</div>' +
    '<div class="focusMeta">' +
      rageMeta +
      infectionMeta +
      '<span class="statusPill">' + renderStatusIcons(player) + '</span>' +
      '<span>手牌 ' + player.hand.length + '</span>' +
    '</div>' +
    '<div class="focusEquip">' +
      equipmentButton('weapon', '武器', player.equipment.weapon) +
      equipmentButton('armor', '防具', player.equipment.armor) +
    '</div>' +
    feedback.markup +
    renderActionCountdown(player) +
  '</aside>';
}

function renderSkillChoiceContent(title, description, choices, actions, playerId = '') {
  const describedSkillId = description && Object.keys(skillDescriptions).find(id => skillDescriptions[id].text === description);
  return '<div class="skillInfo"><header class="skillChoiceHeader"><strong>' + safeText(title) + '</strong>' +
    (playerId ? '<button type="button" aria-label="取消' + safeText(title) + '" onclick="cancelActiveSkillCost(\'' + playerId + '\')">取消</button>' : '') +
    '</header><div class="skillChoiceBody">' +
    (describedSkillId ? renderSkillCopy(describedSkillId) : description ? '<p class="skillChoiceDescription">' + safeText(description) + '</p>' : '') + choices +
    '</div>' + (actions ? '<footer class="skillChoiceActions">' +
      (choices.includes('choiceCard') ? '<span class="skillChoiceSummary" role="status"></span>' : '') + actions + '</footer>' : '') + '</div>';
}

function renderActiveSkillPanel(player, onBoard = false) {
  if (!player || !selectedSkills[player.id]) return '';
  if (activeSkillCostDraft(player)) return '';
  if (isReadOnlySkillSelection(player)) return '';
  const info = skillInfo(player, onBoard);
  if (!info) return '';
  return '<section class="activeSkillPanel" role="dialog" aria-label="' + safeText(skillDescriptions[selectedSkills[player.id]]?.name || '技能选择') + '">' + info + '</section>';
}

function skillDecisionKey(decision) {
  if (!decision) return '';
  return [
    decision.kind,
    decision.playerId,
    decision.sourceId || '',
    decision.targetId || '',
    state.round || 0
  ].join(':');
}

function skillDecisionDraft(decision) {
  const key = skillDecisionKey(decision);
  if (!skillDecisionDrafts[key]) skillDecisionDrafts[key] = {};
  return skillDecisionDrafts[key];
}

function sagittariusResupplySelection() {
  const decision = state.pendingSkillDecisions?.[0];
  if (state.pendingRescue || decision?.kind !== 'sagittariusResupply') return null;
  const player = state.players.find(candidate => candidate.id === decision.playerId);
  if (!player || player.control !== 'human' || player.hp <= 0 || player.eliminated) return null;
  const draft = skillDecisionDraft(decision);
  return draft.selectingTarget ? { decision, draft } : null;
}

function canSelectSagittariusResupplyTarget(targetId) {
  if (!sagittariusResupplySelection() || sagittariusResupplyInFlight) return false;
  const target = state.players.find(candidate => candidate.id === targetId);
  return Boolean(target && target.hp > 0 && !target.eliminated && target.hand.length < Math.min(4, target.maxHp));
}

function beginSagittariusResupply() {
  const decision = state.pendingSkillDecisions?.[0];
  if (state.pendingRescue || decision?.kind !== 'sagittariusResupply' || sagittariusResupplyInFlight) return;
  const player = state.players.find(candidate => candidate.id === decision.playerId);
  if (!player || player.control !== 'human' || player.hp <= 0 || player.eliminated) return;
  clearSelectedCard();
  delete selectedSkills[player.id];
  inspectedPlayerId = '';
  seatSkillTip = null;
  skillDecisionDrafts[skillDecisionKey(decision)] = { selectingTarget: true };
  render();
}

function selectSagittariusResupplyTarget(targetId) {
  if (!canSelectSagittariusResupplyTarget(targetId)) return;
  setSkillDecisionDraft('targetId', targetId);
}

function boardSkillSelection() {
  if (!state || setupPaused || lobbyOpen || state.pendingRescue || state.phase === 'gameOver') return null;
  const decision = state.pendingSkillDecisions?.[0];
  const player = state.players.find(candidate => candidate.id === (decision?.playerId || state.activePlayerId));
  if (!player || player.control !== 'human' || player.hp <= 0 || player.eliminated) return null;
  const pendingNames = {taurusGuardSetup:'护渡',taurusGuard:'护渡',taurusThickSkin:'神躯',virgoDiscipline:'星律',aquariusWindCut:'断流',aquariusChalice:'倾杯',libraJudgment:'审判',libraPerfectJudgment:'完美审判'};
  const kind = decision?.kind || selectedSkills[player.id];
  const cost = decision ? null : activeSkillCostDraft(player);
  const complex = ['capricorn.charge','gemini.steal','scorpio.spoils','libra.harmony','pisces.balance'];
  if (decision ? !pendingNames[kind] : state.phase !== 'main' || (!cost?.requiresTarget && !complex.includes(kind)) || isReadOnlySkillSelection(player)) return null;
  const optional = Boolean(decision && !['libraJudgment','libraPerfectJudgment'].includes(kind));
  const key = clientMatchId + ':' + (decision ? skillDecisionKey(decision) : player.id + ':' + kind + ':' + state.round);
  const charge = kind === 'capricorn.charge' ? capricornChargeDraft(player) : null;
  if (kind === 'capricorn.charge' && !charge) return null;
  if (boardSkillUI.key !== key) boardSkillUI = {key,stage:optional ? 'prompt' : charge && !charge.option ? 'options' : 'targets',targetIds:[]};
  const draft = decision ? skillDecisionDraft(decision) : null;
  let targets = state.players.filter(candidate => candidate.hp > 0 && !candidate.eliminated);
  let targetIds = boardSkillUI.targetIds;
  let min = 1, max = 1;
  const immediate = ['taurusGuard','virgoDiscipline'].includes(kind);
  if (cost?.requiresTarget) {
    targets = targets.filter(target => canReleaseSkillCostOnSeat(player.id,target.id));
    if (kind === 'leo.roar') { targetIds = cost.targetIds; max = 3; }
  } else if (['taurusGuardSetup','aquariusWindCut','aquariusChalice','libra.harmony','capricorn.charge','scorpio.spoils'].includes(kind)) {
    targets = targets.filter(target => target.id !== player.id);
  } else if (kind === 'gemini.steal') targets = enemiesOf(player).filter(target => target.hp > 0 && !target.eliminated);
  if (['libraJudgment','libraPerfectJudgment','aquariusWindCut','scorpio.spoils'].includes(kind)) targets = targets.filter(target => !player.flags.iceArmorBlockedTargetIds?.includes(target.id));
  if (['taurusGuardSetup','aquariusWindCut','libraJudgment','libraPerfectJudgment'].includes(kind)) targetIds = draft.targetId ? [draft.targetId] : [];
  if (kind === 'taurusThickSkin') { targetIds = [decision.sourceId]; targets = targets.filter(target => target.id === decision.sourceId); }
  if (kind === 'aquariusChalice') { targets=targets.filter(target=>target.hand.length>0);targetIds = aquariusChaliceDraft(player.id).targets.map(target => target.id); max = 2; }
  if (kind === 'libra.harmony') { targetIds = libraHarmonyDrafts[player.id]?.targetIds || []; min = max = 2; }
  if (kind === 'pisces.balance') { targetIds = piscesBalanceDrafts[player.id]?.targetIds || []; min = max = 2; }
  if (charge) { targetIds = charge.targetIds; max = charge.maxTargets; }
  if (kind === 'scorpio.spoils') { targets = scorpioDisarmTargets(player); targetIds = spoilsDrafts[player.id]?.targetId ? [spoilsDrafts[player.id].targetId] : []; }
  const validTargetIds = targetIds.filter(id => targets.some(target => target.id === id));
  const allTargetsValid = validTargetIds.length === targetIds.length;
  targetIds = validTargetIds;
  let ready = allTargetsValid && targetIds.length >= min && targetIds.length <= max;
  if (cost) ready = ready && cost.ready;
  if (['taurusGuardSetup','taurusThickSkin'].includes(kind)) ready = ready && draft.cardIds?.length === 1 && player.hand.some(card => card.id === draft.cardIds[0]);
  if (kind === 'gemini.steal') { const ids=stealDrafts[player.id]?.costCardIds || []; ready=ready && [1,2].includes(ids.length) && ids.every(id=>player.hand.some(card=>card.id===id)); }
  if (kind === 'scorpio.spoils') ready = ready && player.hand.some(card => card.id === spoilsDrafts[player.id]?.costCardId) && scorpioDisarmOptions(player,state.players.find(target=>target.id===targetIds[0])).length > 0;
  if (kind === 'libra.harmony') { const requirement=libraHarmonyRequirement(player.id); ready=ready && requirement.valid && (libraHarmonyDrafts[player.id]?.costCardIds || []).length === requirement.required; }
  if (kind === 'pisces.balance') ready = ready && (piscesBalanceDrafts[player.id]?.costCardIds || []).length === piscesBalanceRequirement(player.id).required;
  if (charge) ready = charge.ready;
  return {key,player,kind,name:decision ? pendingNames[kind] : skillDescriptions[kind].name,decision,cost,charge,draft,optional,immediate,targets,targetIds,min,max,stage:boardSkillUI.stage,ready:Boolean(ready)};
}

function canSelectBoardSkillTarget(targetId) {
  const selection = boardSkillSelection();
  return Boolean(selection && selection.stage === 'targets' && !boardSkillBusy && selection.targets.some(target=>target.id===targetId) &&
    (selection.max === 1 || selection.targetIds.includes(targetId) || selection.targetIds.length < selection.max));
}

function openBoardSkillOptionsIfNeeded() {
  const selection=boardSkillSelection();
  if (!selection || selection.stage!=='targets' || !selection.ready || selection.max!==1 || boardSkillBusy) return;
  const target=state.players.find(player=>player.id===selection.targetIds[0]);
  const needsOptions=selection.kind==='libraPerfectJudgment' ||
    selection.kind==='aquariusWindCut' && target.hand.length>0 ||
    selection.kind==='gemini.steal' && stealTargetsOf(target).length>0 ||
    selection.kind==='scorpio.spoils' && scorpioDisarmOptions(selection.player,target).length>1;
  if (needsOptions) {boardSkillUI.stage='options';render();}
}

function selectBoardSkillTarget(targetId) {
  const selection = boardSkillSelection();
  if (!selection || !canSelectBoardSkillTarget(targetId)) return;
  const {kind,player} = selection;
  if (kind === 'leo.roar') return toggleLeoRoarTarget(player.id,targetId);
  if (kind === 'capricorn.charge') return toggleCapricornChargeTarget(player.id,targetId);
  if (kind === 'libra.harmony') return toggleLibraHarmonyTarget(player.id,targetId);
  if (kind === 'pisces.balance') return togglePiscesBalanceTarget(player.id,targetId);
  if (kind === 'aquariusChalice') return toggleAquariusChaliceTarget(player.id,targetId);
  if (kind === 'taurusThickSkin') return;
  if (kind === 'scorpio.spoils') return setSpoilsDraft(player.id,'targetId',targetId);
  if (selection.decision) {
    if (selection.draft.targetId !== targetId && ['aquariusWindCut','libraPerfectJudgment'].includes(kind)) { selection.draft.cardIds=[]; selection.draft.selectedCardId=''; }
    return setSkillDecisionDraft('targetId',targetId);
  }
  if (kind === 'gemini.steal') { targetDrafts[player.id]={...(targetDrafts[player.id]||{}),enemyId:targetId}; stealDrafts[player.id]={...(stealDrafts[player.id]||{}),targetCardId:''}; }
  boardSkillUI.targetIds = [targetId];
  render();
}

function submitBoardSkill(callback) {
  if (boardSkillBusy) return;
  boardSkillBusy = true;
  render();
  const finish = () => {boardSkillBusy=false;boardSkillUI={key:'',stage:'targets',targetIds:[]};render();};
  try { return Promise.resolve(callback()).finally(finish); } catch (failure) { finish(); throw failure; }
}

function beginBoardSkill() {
  const selection = boardSkillSelection();
  if (!selection || boardSkillBusy) return;
  if (selection.immediate) return submitBoardSkill(()=>resolvePendingSkillDecision(true));
  clearSelectedCard(); inspectedPlayerId=''; seatSkillTip=null;
  boardSkillUI.stage = 'targets';
  render();
}

function cancelBoardSkill() {
  const selection=boardSkillSelection();
  if (!selection || boardSkillBusy) return;
  if (selection.decision) return selection.optional ? submitBoardSkill(()=>resolvePendingSkillDecision(false)) : undefined;
  for (const drafts of [stealDrafts,spoilsDrafts,libraHarmonyDrafts,piscesBalanceDrafts]) delete drafts[selection.player.id];
  boardSkillUI={key:'',stage:'targets',targetIds:[]};
  return cancelActiveSkillCost(selection.player.id);
}

function returnBoardSkillTargets() {
  if (!boardSkillSelection() || boardSkillBusy) return;
  boardSkillUI.stage='targets'; render();
}

function confirmBoardSkillTargets() {
  const selection=boardSkillSelection();
  if (!selection || selection.stage !== 'targets' || !selection.ready || boardSkillBusy) return;
  const {kind,player,targetIds}=selection;
  if (selection.cost) return submitBoardSkill(()=>confirmActiveSkillCost(player.id,targetIds[0]));
  if (kind === 'capricorn.charge') return submitBoardSkill(()=>confirmCapricornCharge(player.id));
  if (kind === 'pisces.balance') return submitBoardSkill(()=>confirmPiscesBalance(player.id));
  if (kind === 'scorpio.spoils') {
    const options=scorpioDisarmOptions(player,state.players.find(target=>target.id===targetIds[0]));
    if (options.length===1) {Object.assign(spoilsDrafts[player.id],options[0]);return submitBoardSkill(()=>confirmScorpioSpoils(player.id));}
  }
  if (kind === 'gemini.steal' && !stealTargetsOf(selectedEnemyOf(player)).length) return submitBoardSkill(()=>confirmSteal(player.id));
  if (selection.decision && !['aquariusChalice','libraPerfectJudgment'].includes(kind) && (kind !== 'aquariusWindCut' || !state.players.find(target=>target.id===targetIds[0]).hand.length)) return submitBoardSkill(()=>resolvePendingSkillDecision(true));
  boardSkillUI.stage='options'; render();
}

function confirmBoardSkillOptions() {
  const selection=boardSkillSelection();
  if (!selection || selection.stage !== 'options' || !selection.ready || boardSkillBusy) return;
  return submitBoardSkill(()=>selection.decision ? resolvePendingSkillDecision(true) :
    selection.kind==='gemini.steal' ? confirmSteal(selection.player.id) :
    selection.kind==='libra.harmony' ? confirmLibraHarmony(selection.player.id) :
    selection.kind==='scorpio.spoils' ? confirmScorpioSpoils(selection.player.id) : undefined);
}

function boardSkillHandDraft(player) {
  if (!player) return null;
  const selection=boardSkillSelection();
  if (!selection || selection.player.id!==player.id || selection.stage==='prompt' || selection.cost) return null;
  const {kind,draft}=selection;
  let valid=player.hand, selected=[];
  if (['taurusGuardSetup','taurusThickSkin'].includes(kind)) selected=draft.cardIds || [];
  else if (kind==='gemini.steal') selected=stealDrafts[player.id]?.costCardIds || [];
  else if (kind==='scorpio.spoils') selected=spoilsDrafts[player.id]?.costCardId ? [spoilsDrafts[player.id].costCardId] : [];
  else if (kind==='libra.harmony') { valid=libraHarmonyRequirement(player.id).valid ? valid.filter(card=>card.element==='air') : []; selected=libraHarmonyDrafts[player.id]?.costCardIds || []; }
  else if (kind==='pisces.balance') { const requirement=piscesBalanceRequirement(player.id);valid=requirement.targets.length===2 && requirement.required>0 ? valid.filter(card=>card.element==='water') : []; selected=piscesBalanceDrafts[player.id]?.costCardIds || []; }
  else if (kind==='capricorn.charge') {valid=selection.charge.needsDistance ? valid : [];selected=selection.charge.extraCostCardId ? [selection.charge.extraCostCardId] : [];}
  else valid=[];
  return {skillId:kind,costCardIds:selected,validCardIds:boardSkillBusy ? [] : valid.map(card=>card.id)};
}

function toggleBoardSkillCost(playerId,cardId) {
  const selection=boardSkillSelection(), hand=boardSkillHandDraft(state.players.find(player=>player.id===playerId));
  if (!selection || !hand?.validCardIds.includes(cardId) || boardSkillBusy) return;
  if (['taurusGuardSetup','taurusThickSkin'].includes(selection.kind)) return setSkillDecisionDraft('cardIds',hand.costCardIds.includes(cardId) ? [] : [cardId]);
  if (selection.kind==='gemini.steal') return toggleStealCost(playerId,cardId);
  if (selection.kind==='scorpio.spoils') return setSpoilsDraft(playerId,'costCardId',hand.costCardIds.includes(cardId) ? '' : cardId);
  if (selection.kind==='libra.harmony') return toggleLibraHarmonyCard(playerId,'costCardIds',cardId);
  if (selection.kind==='pisces.balance') return togglePiscesBalanceCost(playerId,cardId);
  if (selection.kind==='capricorn.charge') return setCapricornChargeDraft(playerId,'extraCostCardId',hand.costCardIds.includes(cardId) ? '' : cardId);
}

function boardSkillHint() {
  const selection=boardSkillSelection();
  if (!selection || selection.stage==='prompt') return '';
  const costs=boardSkillHandDraft(selection.player) || selection.cost;
  let hint=costs?.validCardIds.length ? '选择费用牌和高亮角色，再点确定。' : '点击高亮角色选择目标，再点确定。';
  const fees={'aries.ram':'费用：1 张火普通攻击或状态攻击。','aries.burnSoul':'费用：1 张非火普通攻击或状态攻击。','cancer.heal':'费用：1 张任意手牌。','leo.order':'费用：1 张任意手牌。','virgo.purify':'费用：1 张土牌。','leo.roar':'费用：1 张火牌。','scorpio.freezeAoe':'费用：1 张水牌 + 1 张任意牌。'};
  if (selection.cost && !selection.cost.ready && !(selection.kind==='leo.roar' && selection.cost.costCardIds.length===1)) hint=fees[selection.kind] || hint;
  if (selection.kind==='taurusThickSkin') hint='选择 1 张手牌作为费用，再点确定。';
  if (selection.kind==='libra.harmony' && selection.targetIds.length===2 && !libraHarmonyRequirement(selection.player.id).valid) hint='两名角色手牌差不足 2，不能发动裁衡。';
  if (selection.kind==='pisces.balance' && piscesBalanceRequirement(selection.player.id).required>selection.player.hand.filter(card=>card.element==='water').length) hint='没有足够水牌。';
  if (selection.charge?.needsDistance && !selection.player.hand.length) hint='跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
  return selection.name+'（'+selection.targetIds.length+'/'+selection.max+'）：'+hint;
}

function renderBoardSkillPanel(player) {
  const selection=boardSkillSelection();
  if (!selection || selection.player.id!==player?.id) return undefined;
  if (boardSkillBusy || selection.stage==='targets') return '';
  if (selection.stage==='prompt') return '<section class="activeSkillPanel skillActivationPrompt" role="dialog" aria-label="是否发动'+safeText(selection.name)+'？"><strong>是否发动'+safeText(selection.name)+'？</strong><div class="skillActivationChoices"><button onclick="beginBoardSkill()">是</button><button onclick="cancelBoardSkill()">否</button></div></section>';
  return selection.decision ? renderPendingSkillDecisionPanel(player,true) : renderActiveSkillPanel(player,true);
}

function setSkillDecisionDraft(field, value) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  const key = skillDecisionKey(decision);
  skillDecisionDrafts[key] = { ...skillDecisionDraft(decision), [field]: value };
  render();
}

function toggleSkillDecisionCard(cardId) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  const key = skillDecisionKey(decision);
  const draft = skillDecisionDraft(decision);
  const selected = draft.cardIds || [];
  const max = decision.kind === 'aquariusWindCut' ? Math.min(2, state.players.find(player => player.id === draft.targetId)?.hand.length || 0) : 1;
  const cardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : max === 1
      ? [cardId]
      : selected.length < max
        ? [...selected, cardId]
        : [...selected.slice(1), cardId];
  skillDecisionDrafts[key] = { ...draft, cardIds };
  render();
}

function resolvePendingSkillDecision(activate) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  if (decision.kind === 'scorpioPoisonTake') {
    if (!activate || scorpioPoisonTakeInFlight) return;
    const player = state.players.find(candidate => candidate.id === decision.playerId);
    const target = state.players.find(candidate => candidate.id === decision.targetId);
    const draft = skillDecisionDraft(decision);
    if (draft.cardIds?.length !== 1 || !target?.hand.some(card => card.id === draft.cardIds[0])) return;
    scorpioPoisonTakeInFlight = true;
    delete skillDecisionDrafts[skillDecisionKey(decision)];
    render();
    return action({type:'resolveSkillDecision',playerId:player.id,activate:true,selectedCardId:draft.cardIds[0]}).finally(() => {scorpioPoisonTakeInFlight=false;render();});
  }
  if (decision.kind === 'aquariusChalice') {
    if (aquariusChaliceInFlight) return;
    if (activate) return confirmAquariusChalice(decision.playerId);
    aquariusChaliceInFlight = true;
    render();
    return action({type:'resolveSkillDecision',playerId:decision.playerId,activate:false}).finally(() => {aquariusChaliceInFlight=false;render();});
  }
  if (decision.kind === 'scorpioEndPeek') {
    if (scorpioPeekInFlight) return;
    if (activate) return confirmScorpioPeek(decision.playerId);
    scorpioPeekInFlight = true;
    render();
    return action({type:'resolveSkillDecision',playerId:decision.playerId,activate:false}).finally(() => {scorpioPeekInFlight=false;render();});
  }
  if (decision.kind === 'sagittariusResupply') {
    if (sagittariusResupplyInFlight) return;
    const draft = skillDecisionDraft(decision);
    const target = state.players.find(candidate => candidate.id === draft.targetId && candidate.hp > 0 && !candidate.eliminated);
    if (activate && !canSelectSagittariusResupplyTarget(target?.id)) return;
    const key = skillDecisionKey(decision);
    sagittariusResupplyInFlight = true;
    render();
    return action({type:'resolveSkillDecision',playerId:decision.playerId,activate,targetId:activate ? target.id : undefined})
      .finally(() => {delete skillDecisionDrafts[key];sagittariusResupplyInFlight=false;render();});
  }
  const taurusDecision = ['taurusGuardSetup', 'taurusGuard', 'taurusThickSkin'].includes(decision.kind);
  if (taurusDecision && taurusDecisionInFlight) return;
  const key = skillDecisionKey(decision);
  const draft = skillDecisionDraft(decision);
  delete skillDecisionDrafts[key];
  const body = {
    type: 'resolveSkillDecision',
    playerId: decision.playerId,
    activate,
    targetId: draft.targetId,
    cardIds: draft.cardIds || [],
    selectedCardId: draft.selectedCardId || draft.cardIds?.[0],
    option: draft.option
  };
  if (!taurusDecision) return action(body);
  taurusDecisionInFlight = true;
  render();
  return action(body).finally(() => { taurusDecisionInFlight = false; render(); });
}

function renderPendingSkillDecisionPanel(player, onBoard = false) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision || !player || decision.playerId !== player.id || player.control !== 'human') return '';
  if (decision.kind === 'sagittariusResupply') {
    if (sagittariusResupplySelection() || sagittariusResupplyInFlight) return '';
    return '<section class="activeSkillPanel sagittariusResupplyPrompt" role="dialog" aria-label="是否发动缪斯之弦？">' +
      '<strong>是否发动缪斯之弦？</strong><div class="sagittariusResupplyChoices">' +
      '<button onclick="beginSagittariusResupply()">是</button>' +
      '<button onclick="resolvePendingSkillDecision(false)">否</button></div></section>';
  }
  if (decision.kind === 'scorpioEndPeek') {
    const content = scorpioPeekChoices(player, true);
    return '<section class="activeSkillPanel" role="dialog" aria-label="回合结束窥星">' + renderSkillChoiceContent('窥星', skillDescriptions['scorpio.peek'].text, content.chooser, content.actions) + '</section>';
  }
  const draft = skillDecisionDraft(decision);
  const optionalKinds = new Set(['taurusGuardSetup', 'taurusGuard', 'taurusThickSkin', 'virgoDiscipline', 'aquariusWindCut', 'aquariusChalice']);
  const taurusDecision = ['taurusGuardSetup', 'taurusGuard', 'taurusThickSkin'].includes(decision.kind);
  const taurusSource = state.players.find(candidate => candidate.id === decision.sourceId);
  const currentGuard = state.players.find(candidate => candidate.id === player.flags.taurusGuardTargetId && candidate.hp > 0 && !candidate.eliminated);
  const titles = {
    scorpioPoisonTake: '蝎毒：查看并获得 1 张手牌',
    taurusGuardSetup: '护渡：设置或更换守护',
    taurusGuard: '护渡：是否代承攻击',
    taurusThickSkin: '神躯：是否弃牌反击',
    virgoDiscipline: '是否发动星律',
    aquariusWindCut: '是否发动断流',
    aquariusChalice: '倾杯触发：摸 2 牌（可选换牌）',
    libraJudgment: '审判：选择致盲目标',
    libraPerfectJudgment: onBoard ? '完美审判：选择效果' : '完美审判：选择目标与效果'
  };
  let chooser = '';
  let canConfirm = true;

  if (decision.kind === 'scorpioPoisonTake') {
    const target = state.players.find(candidate => candidate.id === decision.targetId);
    const cards = target?.hand || [];
    const options = cards.map(card => '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">' + cardText(card) + '</button>').join('');
    canConfirm = (draft.cardIds || []).length === 1 && cards.some(card => card.id === draft.cardIds[0]);
    chooser = '<p>冰冻已先行结算。查看目标手牌并选择获得 1 张；不能选择装备，夺牌不追加伤害。</p><div class="choiceGrid">' + options + '</div>';
  }

  if (decision.kind === 'taurusGuardSetup') {
    const targets = state.players.filter(candidate => candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated);
    const cards = player.hand.map(card => '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">' + cardText(card) + '</button>').join('');
    const choices = targets.map(target => '<button class="choiceCard ' + (draft.targetId === target.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'targetId\', \'' + target.id + '\')">' + safeText(characterVisual(target).name) + (currentGuard?.id === target.id ? ' · 当前守护' : '') + '</button>').join('');
    canConfirm = (draft.cardIds || []).length === 1 && player.hand.some(card => card.id === draft.cardIds[0]) && targets.some(target => target.id === draft.targetId);
    chooser = '<div class="skillHint">' + (currentGuard ? '当前守护：' + safeText(characterVisual(currentGuard).name) + '。选择“延续守护”无需弃牌。' : '当前没有守护对象，可以设置一名，或本回合不设置。') + '</div>' +
      '<div class="chooserLabel">选择弃置的 1 张手牌</div><div class="choiceGrid">' + (cards || '<div class="skillHint">没有手牌，可以延续原守护或跳过。</div>') + '</div>' +
      '<div class="chooserLabel">选择一名守护对象</div><div class="choiceGrid">' + choices + '</div>';
  }

  if (decision.kind === 'taurusGuard') {
    const target = state.players.find(candidate => candidate.id === decision.targetId);
    canConfirm = player.hp > 0 && Boolean(target && target.hp > 0 && player.flags.taurusGuardTargetId === target.id && state.pendingAttack?.currentTargetId === target.id);
    chooser = '<p>' + safeText(taurusSource ? characterVisual(taurusSource).name : '攻击者') + ' 使用“' + safeText(state.pendingAttack?.card.name || '攻击牌') + '”指定了“' + safeText(target ? characterVisual(target).name : '守护对象') + '”。</p>' +
      '<div class="skillHint">无需弃牌。代承后由你成为攻击目标，并正常进行防御；本次不代承仍会保留守护关系。</div>';
  }

  if (decision.kind === 'taurusThickSkin') {
    const options = player.hand.map(card =>
      '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    canConfirm = (draft.cardIds || []).length === 1 && player.hand.some(card => card.id === draft.cardIds[0]) && player.hp > 0 && Boolean(taurusSource && taurusSource.hp > 0 && !taurusSource.eliminated);
    chooser = '<div class="skillHint">本次攻击使你失去护甲或生命。' + safeText(taurusSource ? characterVisual(taurusSource).name : '伤害来源') + (taurusSource?.statuses.silence ? ' 已沉默；弃牌后对其造成 1 点普通伤害。' : ' 尚未沉默；弃牌后令其沉默，持续至其下一个回合开始。') + '</div>' +
      '<div class="chooserLabel">选择弃置的 1 张手牌，也可以不反击</div><div class="choiceGrid">' + (options || '<div class="skillHint">没有手牌，不能反击。</div>') + '</div>';
  }

  if (decision.kind === 'aquariusWindCut') {
    const targets = state.players.filter(candidate => candidate.hp > 0 && candidate.id !== player.id);
    const target = targets.find(candidate => candidate.id === draft.targetId) || (!onBoard ? targets[0] : null);
    if (!draft.targetId && target) draft.targetId = target.id;
    const targetOptions = targets.map(candidate =>
      '<button class="choiceCard ' + (target?.id === candidate.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'targetId\', \'' + candidate.id + '\'); setSkillDecisionDraft(\'cardIds\', [])">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + '</button>'
    ).join('');
    const required = Math.min(2, target?.hand.length || 0);
    const cardBacks = target?.hand.map((card, index) =>
      '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">目标手牌 ' + (index + 1) + '</button>'
    ).join('') || '<div class="skillHint">目标没有手牌；发动后仍会造成 1 点伤害。</div>';
    canConfirm = Boolean(target) && (draft.cardIds || []).length === required;
    chooser = (onBoard ? '' : '<div class="chooserLabel">选择断流目标</div><div class="choiceGrid">' + targetOptions + '</div>') +
      '<div class="chooserLabel">选择令其弃置的 ' + required + ' 张手牌</div><div class="choiceGrid">' + cardBacks + '</div>';
  }

  if (decision.kind === 'aquariusChalice') {
    const targets = state.players.filter(candidate => candidate.id !== player.id && candidate.hp > 0);
    const draft = aquariusChaliceDraft(player.id);
    const selectedTargets = draft.targets || [];
    const targetIds = selectedTargets.map(t => t.id);
    const totalGive = selectedTargets.reduce((sum, t) => sum + (t.giveCardIds || []).length, 0);
    const totalTake = selectedTargets.reduce((sum, t) => sum + aquariusChaliceTakeIds(player, t).length, 0);
    const ownHand = player.hand;
    const targetOptions = targets.map(candidate => {
      const inList = targetIds.includes(candidate.id);
      const atMax = targetIds.length >= 2 && !inList;
      return '<button class="choiceCard ' + (inList ? 'selected' : '') + '" ' + (atMax ? 'disabled' : '') + ' onclick="toggleAquariusChaliceTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + (inList ? ' ✓' : '') + '</button>';
    }).join('');
    const perTargetBlocks = selectedTargets.map(t => {
      const target = targets.find(c => c.id === t.id);
      const giveCardIds = t.giveCardIds || [];
      const takeCardIds = aquariusChaliceTakeIds(player, t);
      const giveOptions = ownHand.map(card =>
        '<button class="choiceCard ' + (giveCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleAquariusChaliceGive(\'' + player.id + '\', \'' + t.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
      ).join('');
      const takeOptions = target && target.hand.length > 0
        ? !aquariusChaliceCanView(player, target)
          ? Array.from({length:target.hand.length}, () => '<div class="choiceCard cardBackChoice hasCardBackArt" role="img" aria-label="敌方手牌">' + assetImageHtml('cardBackArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '手牌背面') + '<strong>敌方手牌</strong><span>随机交换</span></div>').join('') +
            '<div class="skillHint">确认后随机取回 ' + giveCardIds.length + ' 张；不能指定敌方手牌。</div>'
          : target.hand.map(card =>
            '<button class="choiceCard ' + (takeCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleAquariusChaliceTake(\'' + player.id + '\', \'' + t.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
          ).join('')
        : '<div class="skillHint">该目标没有手牌，不能交换。</div>';
      return '<div class="chaliceTargetBlock">' +
        '<div class="chooserLabel">与 ' + safeText(characterVisual(target).name) + ' 交换' +
        ' <button class="miniRemove" onclick="toggleAquariusChaliceTarget(\'' + player.id + '\', \'' + t.id + '\')">移除</button></div>' +
        '<div class="chooserLabel">你交出（' + giveCardIds.length + ' 张）</div><div class="choiceGrid">' + (giveOptions || '<div class="skillHint">你没有手牌。</div>') + '</div>' +
        '<div class="chooserLabel">你取回（' + takeCardIds.length + ' 张）</div><div class="choiceGrid">' + takeOptions + '</div>' +
        '</div>';
    }).join('');
    canConfirm = totalGive > 0 && totalGive === totalTake && totalGive <= 2 &&
      new Set(selectedTargets.flatMap(t => t.giveCardIds || [])).size === totalGive &&
      selectedTargets.every(t => {
        const target = targets.find(candidate => candidate.id === t.id);
        const takeIds = aquariusChaliceTakeIds(player, t);
        return target && (t.giveCardIds || []).length === takeIds.length && takeIds.length <= target.hand.length &&
          (!aquariusChaliceCanView(player, target) || takeIds.every(id => target.hand.some(card => card.id === id)));
      });
    chooser = '<div class="skillChooser">' +
      (onBoard ? '' : '<div><div class="chooserLabel">选择交换对象（0-2 名，可不选）</div><div class="choiceGrid">' + (targetOptions || '<div class="skillHint">没有可交换目标。</div>') + '</div></div>') +
      (perTargetBlocks || '') +
      '</div>';
  }

  if (decision.kind === 'libraJudgment' || decision.kind === 'libraPerfectJudgment') {
    const targets = state.players.filter(candidate => candidate.hp > 0);
    const target = targets.find(candidate => candidate.id === draft.targetId);
    const targetOptions = targets.map(candidate =>
      '<button class="choiceCard ' + (draft.targetId === candidate.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'targetId\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + '</button>'
    ).join('');
    chooser = onBoard ? '' : '<div class="chooserLabel">选择目标</div><div class="choiceGrid">' + targetOptions + '</div>';
    canConfirm = Boolean(target);
    if (decision.kind === 'libraPerfectJudgment') {
      chooser += '<div class="chooserLabel">选择效果</div><div class="choiceGrid">' +
        '<button class="choiceCard ' + (draft.option === 'damage' ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'option\', \'damage\')">造成 1 点伤害</button>' +
        '<button class="choiceCard ' + (draft.option === 'steal' ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'option\', \'steal\')">获得目标 1 张手牌</button></div>';
      if (draft.option === 'steal' && target) {
        const cards = target.hand.map((card, index) =>
          '<button class="choiceCard ' + (draft.selectedCardId === card.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'selectedCardId\', \'' + card.id + '\')">目标手牌 ' + (index + 1) + '</button>'
        ).join('');
        chooser += '<div class="chooserLabel">选择获得的手牌</div><div class="choiceGrid">' + (cards || '<div class="skillHint">目标没有手牌，请改选造成伤害。</div>') + '</div>';
      }
      canConfirm = Boolean(target) && (draft.option === 'damage' || (draft.option === 'steal' && Boolean(draft.selectedCardId)));
    }
  }

  const confirmText = {
    scorpioPoisonTake: '确认获得',
    taurusGuardSetup: '弃牌并确认守护',
    taurusGuard: '代承攻击',
    taurusThickSkin: taurusSource?.statuses.silence ? '弃牌并造成 1 点伤害' : '弃牌并沉默来源',
    virgoDiscipline: '发动星律',
    aquariusWindCut: '发动断流',
    aquariusChalice: '确认换牌',
    libraJudgment: '确认审判',
    libraPerfectJudgment: '确认完美审判'
  }[decision.kind] || '确认';
  const declineText = {taurusGuardSetup:currentGuard?'延续守护':'本回合不设置',taurusGuard:'不代承',taurusThickSkin:'不反击',aquariusChalice:'不交换'}[decision.kind] || '不发动';
  const decisionInFlight = (taurusDecision && taurusDecisionInFlight) || (decision.kind === 'aquariusChalice' && aquariusChaliceInFlight) || (decision.kind === 'scorpioPoisonTake' && scorpioPoisonTakeInFlight);
  if (decisionInFlight) canConfirm = false;
  const actions = onBoard
    ? '<button onclick="returnBoardSkillTargets()">重选目标</button>' + (optionalKinds.has(decision.kind) ? '<button onclick="cancelBoardSkill()">取消</button>' : '') +
      '<button ' + (!canConfirm || boardSkillBusy ? 'disabled' : '') + ' onclick="confirmBoardSkillOptions()">确定</button>'
    : (optionalKinds.has(decision.kind) ? '<button ' + (decisionInFlight ? 'disabled' : '') + ' onclick="resolvePendingSkillDecision(false)">' + declineText + '</button>' : '') +
      '<button ' + (!canConfirm ? 'disabled' : '') + ' onclick="resolvePendingSkillDecision(true)">' + confirmText + '</button>';
  const title = titles[decision.kind] || '技能选择';
  return '<section class="activeSkillPanel" role="dialog" aria-label="' + safeText(title) + '">' +
    renderSkillChoiceContent(title, '', chooser, actions) + '</section>';
}

function isReadOnlySkillSelection(player) {
  const id = player ? selectedSkills[player.id] : '';
  if (!id) return false;
  if (infoOnlySkills.has(id)) return true;
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  return isSkillDisabled(player, id, canAct);
}

function focusedHumanPlayer(active, attackSource, defenseTarget) {
  const decisionOwner = humanDecisionPlayer(active, attackSource, defenseTarget);
  if (decisionOwner) return decisionOwner;
  const local = localHumanPlayer();
  if (local) return local;
  return defenseTarget || attackSource || active;
}

function humanDecisionPlayer(active, attackSource, defenseTarget) {
  const pendingSkillDecision = state.pendingSkillDecisions?.[0];
  if (pendingSkillDecision) {
    const decisionOwner = state.players.find(player => player.id === pendingSkillDecision.playerId);
    if (decisionOwner?.control === 'human') return decisionOwner;
  }
  if (state.phase === 'gameOver' && !state.winnerTeamId) return rescueReviewPlayer();
  if (state.phase === 'mulligan') {
    const lastFocus = state.players.find(player => player.id === lastMulliganFocusId && player.control === 'human');
    const lastFocusStillPending = state.mulliganPendingPlayerIds.includes(lastMulliganFocusId);
    if (lastFocus && lastFocusStillPending) return lastFocus;
    const pending = state.mulliganPendingPlayerIds
      .map(id => state.players.find(player => player.id === id))
      .filter(Boolean);
    const local = localHumanPlayer();
    if (local && pending.some(player => player.id === local.id)) return local;
    return pending.find(player => player.control === 'human') || null;
  }
  if (state.phase === 'response' && defenseTarget?.control === 'human') return defenseTarget;
  if (state.phase === 'infectionResponse' && state.infection?.pendingInfectionCard) {
    const target = state.players.find(player => player.id === state.infection.pendingInfectionCard.targetId);
    if (target?.control === 'human') return target;
  }
  if (state.phase === 'rescue' && (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId) {
    const responder = state.players.find(player => player.id === (state.pendingRescue || state.infection?.pendingDying).currentResponderId);
    if (responder?.control === 'human') return responder;
  }
  if (state.phase === 'reward' && state.infection?.pendingReward?.playerId) {
    const rewarded = state.players.find(player => player.id === state.infection.pendingReward.playerId);
    if (rewarded?.control === 'human') return rewarded;
  }
  if (state.phase === 'hammerBreak' && defenseTarget?.control === 'human') return defenseTarget;
  if (['draw', 'main', 'discard'].includes(state.phase) && active?.control === 'human') return active;
  return null;
}

function localHumanPlayer() {
  if (!state) return null;
  if (!localHumanPlayerId || !state.players.some(player => player.id === localHumanPlayerId)) {
    localHumanPlayerId = state.players.find(player => player.control === 'human')?.id || state.players[0]?.id || '';
  }
  return state.players.find(player => player.id === localHumanPlayerId) || null;
}

function rescueReviewPlayer() {
  if (!state) return null;
  return standardRescueReviewPlayers().find(player => player.control === 'human') || null;
}

function standardRescueReviewPlayers() {
  if (!state || state.mode === 'infection' || state.phase !== 'gameOver' || state.winnerTeamId || state.winnerId) return [];
  const defeatedTeams = [...new Set(state.players.map(player => player.teamId))]
    .filter(teamId => state.players.filter(player => player.teamId === teamId).every(player => player.hp <= 0));
  return state.players.filter(player =>
    defeatedTeams.includes(player.teamId) &&
    player.hand.some(card => card.kind === 'sun' || card.kind === 'energy')
  );
}

function aiRescueReviewPlayer() {
  return standardRescueReviewPlayers().find(player => player.control === 'ai') || null;
}

function renderFocusedHand(player, tableControls = '') {
  if (!player) return '';
  const pendingSkillDecision = !state.pendingRescue && Boolean(state.pendingSkillDecisions?.length);
  const opponent = selectedEnemyOf(player);
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  const canRespond = state.phase === 'response' && state.pendingAttack && state.pendingAttack.currentTargetId === player.id;
  const canRespondInfection = state.phase === 'infectionResponse' &&
    state.infection?.pendingInfectionCard?.targetId === player.id;
  const canRescue = state.phase === 'rescue' &&
    (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId === player.id;
  const canHammerBreak = state.phase === 'hammerBreak' && state.pendingAttack && state.pendingAttack.currentTargetId === player.id;
  const canDiscard = state.phase === 'discard' && state.activePlayerId === player.id && player.control === 'human';
  const discardRequired = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const selectedDiscardIds = (discardDrafts[player.id] || []).filter(cardId => player.hand.some(card => card.id === cardId)).slice(0, discardRequired);
  discardDrafts[player.id] = selectedDiscardIds;
  const distanceDraft = distanceCostDraft?.playerId === player.id ? distanceCostDraft : null;
  const leoOrderDraft = leoOrderPaymentDraft?.playerId === player.id ? leoOrderPaymentDraft : null;
  const waterDraft = waterStealDraft?.playerId === player.id ? waterStealDraft : null;
  const airDraft = airDismantleDraft?.playerId === player.id ? airDismantleDraft : null;
  const boardCostDraft = boardSkillHandDraft(player);
  const skillCostDraft = distanceDraft || leoOrderDraft || waterDraft || airDraft ? null : boardCostDraft || activeSkillCostDraft(player);
  const distanceCandidateIds = distanceDraft ? distanceCostCandidates(player, distanceDraft).map(card => card.id) : [];
  const leoOrderPaymentCandidateIds = leoOrderDraft ? leoOrderPaymentCandidates(player, leoOrderDraft.reservedCardIds || []).map(card => card.id) : [];
  const cards = player.hand.map((card, index) => {
    const skillCostMode = Boolean(skillCostDraft);
    const distanceCostMode = Boolean(distanceDraft);
    const leoOrderPaymentMode = Boolean(leoOrderDraft);
    const distanceCostCandidate = distanceCandidateIds.includes(card.id);
    const leoOrderPaymentCandidate = leoOrderPaymentCandidateIds.includes(card.id);
    const skillCostCandidate = skillCostDraft?.validCardIds.includes(card.id);
    const skillCostSelected = skillCostDraft?.costCardIds.includes(card.id);
    const candidateRescueTarget = canUseRescueCard(player, card) ? dyingRescueTargetOf(player) : null;
    const rescueTarget = shouldPlayCardAsRescue(player, card, candidateRescueTarget) ? candidateRescueTarget : null;
    const crabRescueCard = canRescue && player.characterId === 'cancer' && card.element === 'water' &&
      player.hp > 0 && state.activePlayerId !== player.id && !player.flags.usedCancerRescueThisRound &&
      !isOrdinaryRescueBlocked(dyingRescueTargetOf(player)) &&
      !(state.pendingRescue || state.infection?.pendingDying)?.willTransform;
    const enabled = !boardSkillBusy && (!pendingSkillDecision || boardCostDraft) && (waterDraft || airDraft
      ? false
      : distanceCostMode
      ? distanceCostCandidate
      : leoOrderPaymentMode
      ? leoOrderPaymentCandidate
      : skillCostMode
      ? Boolean(skillCostCandidate)
      : canRespondInfection
        ? card.kind === 'sun' || card.kind === 'ritual'
      : canRescue
        ? card.kind === 'sun' || (state.mode !== 'infection' && card.kind === 'energy') || crabRescueCard
      : rescueTarget
        ? true
      : canDiscard
        ? discardRequired > 0
        : canClickHandCard(player, card, canAct, canRespond, canHammerBreak));
    const handler = distanceCostMode
      ? 'payDistanceCostCard(\'' + player.id + '\', \'' + card.id + '\')'
      : leoOrderPaymentMode
      ? 'payLeoOrderPaymentCard(\'' + player.id + '\', \'' + card.id + '\')'
      : skillCostMode
      ? 'toggleSkillCostCard(\'' + player.id + '\', \'' + card.id + '\')'
      : canDiscard
        ? 'toggleDiscardCard(\'' + player.id + '\', \'' + card.id + '\')'
        : canRespondInfection
          ? 'respondInfection(\'' + player.id + '\', \'' + card.id + '\')'
        : canRescue
          ? crabRescueCard && card.kind !== 'sun' && card.kind !== 'energy'
            ? 'rescueWithCrabGuard(\'' + player.id + '\', \'' + card.id + '\')'
            : 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + ((state.pendingRescue || state.infection?.pendingDying)?.targetId || '') + '\')'
        : rescueTarget
          ? 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + rescueTarget.id + '\')'
        : canRespond
          ? 'defend(\'' + player.id + '\', \'' + card.id + '\')'
          : canHammerBreak
            ? 'earthHammerBreak(\'' + player.id + '\', \'' + card.id + '\')'
            : canAmplifyPendingAttackWithMoon(player, card)
              ? 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + (state.pendingAttack?.currentTargetId || '') + '\')'
            : canAct && cardNeedsTarget(card)
                ? 'selectCardForTarget(\'' + player.id + '\', \'' + card.id + '\')'
                : 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + (opponent?.id || '') + '\')';
    const extraClass = [
      selectedCard?.playerId === player.id && selectedCard?.cardId === card.id ? 'selectedCard' : '',
      selectedDiscardIds.includes(card.id) ? 'discardSelected' : '',
      distanceCostCandidate ? 'skillCostCandidate' : '',
      leoOrderPaymentCandidate ? 'leoOrderPaymentCandidate skillCostCandidate' : '',
      skillCostCandidate ? 'skillCostCandidate' : '',
      skillCostSelected ? 'skillCostSelected' : ''
    ].filter(Boolean).join(' ');
    return renderHandCard(player, card, enabled, handler, '', extraClass, '--card-index:' + (index + 1));
  }).join('');
  const discardControls = canDiscard
    ? '<div class="response discardChooser"><span>弃牌阶段：已选 ' + selectedDiscardIds.length + ' / 需弃 ' + discardRequired + ' 张</span><button ' + (selectedDiscardIds.length === discardRequired ? '' : 'disabled') + ' onclick="confirmDiscard(\'' + player.id + '\')">确认弃牌</button><button onclick="clearDiscardSelection(\'' + player.id + '\')">清空选择</button></div>'
    : '';
  const response = canRespondInfection
    ? '<div class="response"><span>可用太阳或净化仪式抵消感染牌；响应牌会完整结算自身效果。</span><button onclick="respondInfection(\'' + player.id + '\')">不抵消感染</button></div>'
    : canRescue
      ? '<div class="response"><span>' + (state.mode === 'infection' ? '可用太阳急救，恢复至 1 点生命并移除感染。' : '可用太阳、星能或水牌赫拉之护急救，恢复至 1 点生命；太阳额外给予圣盾。') + '</span><button onclick="skipInfectionRescue(\'' + player.id + '\')">放弃急救</button></div>'
    : canRespond
    ? '<div class="response"><span>' + (state.pendingAttack.scorpioPoisonStep ? '蝎毒：交给天蝎 1 张牌；水牌免冰冻，非水牌会冰冻' : '需要响应：' + safeText(state.pendingAttack.card.name)) + '</span><button onclick="skipDefense(\'' + player.id + '\')">' + (state.pendingAttack.scorpioPoisonStep ? '不交牌' : '不出牌') + '</button></div>'
    : canHammerBreak
      ? '<div class="response"><span>撼岳锤：点击 1 张手牌作为额外防御费用</span><button onclick="skipEarthHammerBreak(\'' + player.id + '\')">不支付（防御失效）</button></div>'
      : '';
  const targetCardChoiceOverlay = renderWaterStealChoiceBar(player) + renderAirDismantleChoiceBar(player);
  const interactionOverlay = pendingSkillDecision || boardSkillSelection() ? '' : targetCardChoiceOverlay || (
    tableControls +
    operationHintForFocusedHand(player, canAct, canRespond, canHammerBreak, canRespondInfection, canRescue) +
    renderDistanceCostBar(player) +
    renderLeoOrderPaymentBar(player) +
    renderSkillCostBar(player) +
    discardControls +
    response
  );
  return '<div class="focusedHandBody">' +
    (interactionOverlay ? '<div class="handInteractionOverlay">' + interactionOverlay + '</div>' : '') +
    '<div class="hand focusedHandCards">' + cards + '</div>' +
    '</div>';
}

function operationHintForFocusedHand(player, canAct, canRespond, canHammerBreak, canRespondInfection = false, canRescue = false) {
  if (distanceCostDraft?.playerId === player.id) return '<div class="operationHint">跨距离需要额外弃 1 张手牌：点击一张高亮手牌支付距离费用。</div>';
  if (leoOrderPaymentDraft?.playerId === player.id) return '<div class="operationHint">兽王令触发：点击一张高亮手牌交给狮子，然后继续结算当前出牌。</div>';
  if (waterStealDraft?.playerId === player.id) return '<div class="operationHint">潮汐窃取目标已选：点击一个目标手牌卡背，选择具体偷哪一张。</div>';
  if (airDismantleDraft?.playerId === player.id) return '<div class="operationHint">风拆目标已选：点击目标手牌卡背或装备，选择具体拆哪一张。</div>';
  const skillCostDraft = activeSkillCostDraft(player);
  if (skillCostDraft) {
    const hint = skillCostDraft.skillId === 'pisces.observeTide'
      ? '观潮：已选 ' + skillCostDraft.costCardIds.length + ' 张；点击“确认观潮”弃牌并摸等量牌，再次点击手牌可取消选择。'
      : skillCostDraft.skillId === 'weapon.waterCodex'
      ? skillCostDraft.ready
        ? '素材已选 2/2：点击“确认合成”生成合成牌；再次点击素材可取消选择。'
        : '潮汐合成：点击任意 2 张高亮手牌作为素材，再点击“确认合成”。'
      : skillCostDraft.skillId === 'leo.roar'
      ? skillCostDraft.costCardIds.length === 0
        ? '狮吼：先点击 1 张高亮火牌作为费用。'
        : skillCostDraft.targetIds.length === 0
          ? '狮吼：依次点击战场上的 1–3 名其他存活角色。'
          : '狮吼：已选 ' + skillCostDraft.targetIds.length + '/3 个目标；可继续点选或取消目标，再次点击“狮吼”发动。'
      : skillCostDraft.ready && skillCostDraft.requiresTarget
        ? '费用已选：点击战场上发光的目标角色释放技能。'
        : '技能发动中：点击高亮手牌选择费用。';
    return '<div class="operationHint">' + hint + '</div>';
  }
  if (canRespond && state.pendingAttack?.scorpioPoisonStep) return '<div class="operationHint">点击一张手牌交给天蝎；交水牌可避免冰冻，交非水牌会被冰冻。没有手牌或不交牌时会被冰冻。</div>';
  if (canRespondInfection) return '<div class="operationHint">点击高亮的太阳或净化仪式抵消感染牌，也可以选择不抵消。</div>';
  if (canRescue) return '<div class="operationHint">点击高亮手牌急救当前濒死角色，也可以放弃急救。</div>';
  if (canRespond) return '<div class="operationHint">点击高亮牌进行响应；不想响应时点“不出牌”。</div>';
  if (canHammerBreak) return '<div class="operationHint">点击一张手牌支付撼岳锤的额外防御费用；不支付则本次防御无效。</div>';
  if (player.hand.some(card => canUseRescueCard(player, card))) return '<div class="operationHint">可点击太阳/星能急救濒死角色。</div>';
  if (state.phase === 'discard' && state.activePlayerId === player.id) return '<div class="operationHint">请选择要弃掉的牌，达到数量后点击“确认弃牌”。</div>';
  if (!canAct) return '';
  if (window.TabletopV10) return selectedCard?.playerId === player.id || !player.hand.length
    ? '<div class="operationHint">' + safeText(window.TabletopV10.handHint(player)) + '</div>' : '';
  if (canAct && player.hand.length === 0) return '<div class="operationHint">没有手牌了：点击「结束出牌」进入弃牌阶段。</div>';
  if (selectedCard?.playerId === player.id && selectedCard?.targetIds?.length === 1) {
    const firstTarget = state.players.find(candidate => candidate.id === selectedCard.targetIds[0]);
    return '<div class="operationHint">蚀月战令已选择第一目标 ' + safeText(firstTarget?.name || '') + '；再点击另一名高亮角色释放这张基础攻击牌。再次点击第一目标可重选。</div>';
  }
  if (player.hand.some(card => canClickHandCard(player, card, true, false, false) && cardNeedsTarget(card))) {
    return '<div class="operationHint">点击要出的牌，移动鼠标查看虚线指引，再点击目标角色释放；AOE 再次点击该牌确认释放。</div>';
  }
  return '<div class="operationHint">点击装备牌可直接装备；点击可用功能牌或阶段按钮继续。</div>';
}

function renderDistanceCostBar(player) {
  const draft = distanceCostDraft?.playerId === player.id ? distanceCostDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const cardName = draft.type === 'playCard'
    ? player.hand.find(card => card.id === draft.cardId)?.name || '当前牌'
    : draft.skillId === 'gemini.steal'
      ? '换影'
      : draft.skillId === 'aries.ram'
        ? '金角冲'
        : draft.skillId === 'capricorn.charge'
          ? '山崩'
          : '技能';
  return '<div class="skillCostBar">' +
    '<span><strong>跨距离费用</strong>：' + safeText(cardName) + ' 指向 ' + safeText(target?.name || '目标') + '，跨距离需要额外弃 1 张手牌。</span>' +
    '<div class="skillCostActions"><button onclick="cancelDistanceCost()">取消</button></div>' +
    '</div>';
}

function renderLeoOrderPaymentBar(player) {
  const draft = leoOrderPaymentDraft?.playerId === player.id ? leoOrderPaymentDraft : null;
  if (!draft) return '';
  const receiver = state.players.find(candidate => candidate.id === draft.receiverId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  return '<div class="skillCostBar leoOrderPaymentBar">' +
    '<span><strong>兽王令</strong>：' + safeText(card?.name || '当前牌') + ' 会影响 ' + safeText(receiver?.name || '狮子') + '，先点击 1 张高亮手牌交给狮子。</span>' +
    '<div class="skillCostActions"><button onclick="cancelLeoOrderPayment()">取消</button></div>' +
    '</div>';
}

function renderWaterStealChoiceBar(player) {
  const draft = waterStealDraft?.playerId === player.id ? waterStealDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  const choices = waterStealTargets(target);
  if (!target || !card || choices.length === 0) return '';
  const options = choices.map(choice =>
    '<button class="choiceCard cardBackChoice hasCardBackArt" onclick="chooseWaterStealTarget(\'' + player.id + '\', \'' + choice.id + '\')">' +
      assetImageHtml('cardBackArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '手牌背面') +
      '<strong>' + safeText(choice.label) + '</strong><span>' + safeText(choice.detail) + '</span>' +
    '</button>'
  ).join('');
  return '<div class="skillCostBar waterStealBar">' +
    '<span><strong>潮汐窃取</strong>：只能偷目标手牌。目标每有 1 张手牌，就显示 1 张卡背供你选择。</span>' +
    '<div class="choiceGrid">' + options + '</div>' +
    '<div class="skillCostActions"><button onclick="cancelWaterStealChoice()">取消</button></div>' +
    '</div>';
}

function renderAirDismantleChoiceBar(player) {
  const draft = airDismantleDraft?.playerId === player.id ? airDismantleDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  const choices = airDismantleTargets(target);
  if (!target || !card || choices.length === 0) return '';
  const options = choices.map(choice =>
    '<button class="choiceCard cardBackChoice hasCardBackArt" onclick="chooseAirDismantleTarget(\'' + player.id + '\', \'' + choice.id + '\')">' +
      assetImageHtml('cardBackArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '手牌背面') +
      '<strong>' + safeText(choice.label) + '</strong><span>' + safeText(choice.detail) + '</span>' +
    '</button>'
  ).join('');
  return '<div class="skillCostBar airDismantleBar">' +
    '<span><strong>风之制裁</strong>：选择要拆掉的目标牌。手牌只显示卡背，装备显示名称。</span>' +
    '<div class="choiceGrid">' + options + '</div>' +
    '<div class="skillCostActions"><button onclick="cancelAirDismantleChoice()">取消</button></div>' +
    '</div>';
}

function canUseDefenseCard(player, card) {
  const defenseCard = card;
  const pending = state.pendingAttack;
  if (!pending) return false;
  if (pending.scorpioPoisonStep) return true;
  if (defenseCard.kind === 'sun' || defenseCard.kind === 'moon') return true;
  if (defenseCard.kind !== 'normalAttack') return false;
  if (pending.card.kind === 'aoe') return defenseCard.element === pending.card.element;
  if (pending.card.fusion && pending.card.kind === 'statusAttack') {
    return defenseCard.element === pending.card.element;
  }
  return pending.card.kind === 'normalAttack' || pending.card.kind === 'statusAttack';
}

function renderPlayedCardDisplay(display, extraClass = '') {
  const player = state.players.find(candidate => candidate.id === display.playerId);
  const displayCard = effectiveCardForView(player, display.card);
  const visual = visualForCard(displayCard);
  const cardImages = cardAssetUrls(displayCard);
  return '<div class="playedCardDisplay ' + extraClass + ' ' + visual.className + ' ' + (cardImages.length ? 'hasCardArt' : '') + '">' +
    assetImageHtml('playedCardArt', cardImages, displayCard.name) +
    '<div class="playedCardOwner">' + safeText(player ? battleDisplayName(player) : display.playerId) + '</div>' +
    '<div class="cardIcon">' + safeText(visual.icon) + '</div>' +
    '<div class="playedCardName">' + safeText(displayCard.name) + '</div>' +
    '<div class="playedCardKind">' + safeText(kindLabel(displayCard)) + '</div>' +
    '</div>';
}

function renderPlayedCardActionLine(display) {
  const targetIds = targetIdsForDisplay(display);
  if (!display || targetIds.length === 0) return '';
  const source = state.players.find(candidate => candidate.id === display.playerId);
  const targets = targetIds
    .map(targetId => state.players.find(candidate => candidate.id === targetId))
    .filter(Boolean);
  if (!source || targets.length === 0) return '';
  const targetText = targets.length > 1 ? targets.map(battleDisplayName).join('、') : battleDisplayName(targets[0]);
  return '<div class="playedCardActionLine" aria-label="' + safeText(battleDisplayName(source) + ' 对 ' + targetText) + '">' +
    '<span class="actionSourceLabel">' + safeText(battleDisplayName(source)) + '</span>' +
    '<span class="line" aria-hidden="true"></span>' +
    '<span class="actionTargetLabel">' + safeText(targetText) + '</span>' +
    '</div>';
}

function renderPlayedCards() {
  const playedCards = state.playedCards || { cards: [], sideCards: [] };
  const centerDisplays = playedCards.cards || [];
  const idle = centerDisplays.length === 0 && (!playedCards.sideCards || playedCards.sideCards.length === 0);
  const lineDisplay = [...centerDisplays].reverse().find((display) => targetIdsForDisplay(display).length > 0);
  const hasAoeImpact = Boolean(lineDisplay && lineDisplay.card.kind === 'aoe');
  const layerClass = hasAoeImpact ? 'playedCardsLayer aoeImpact' : 'playedCardsLayer';
  const actionLine = renderPlayedCardActionLine(lineDisplay);
  const cards = centerDisplays
    .map((display) => renderPlayedCardDisplay(display, display === lineDisplay ? 'actionOrigin' : ''))
    .join('');
  const sideCards = (playedCards.sideCards || [])
    .map((display) => renderPlayedCardDisplay(display, 'playedCardEquipSide ' + (display.teamId === 'A' ? 'left' : 'right')))
    .join('');
  if (idle) {
    return '<div class="playedCardsLayer idle"><div class="centerIdlePanel"><strong>等待出牌或响应</strong><small>这里会显示当前出牌、响应牌和攻击指向。</small><div class="centerIdleSteps"><span>点手牌</span><span>点目标</span><span>看中央结算</span></div></div></div>';
  }
  return '<div class="' + layerClass + '">' + actionLine + '<div class="playedCardsCenter">' + cards + '</div>' + sideCards + '</div>';
}

function renderSettlementStats() {
  const rows = state.players.map((player) => {
    const visual = characterVisual(player);
    const damage = state.metrics.damageBySource[player.id] ?? 0;
    const taken = state.metrics.damageTaken[player.id] ?? 0;
    const healing = state.metrics.healingBySource[player.id] ?? 0;
    return '<div class="settlementRow">' +
      '<strong>' + safeText(player.name) + ' · ' + safeText(visual.name) + '</strong>' +
      '<span>造成伤害 ' + damage + '</span>' +
      '<span>承受伤害 ' + taken + '</span>' +
      '<span>治疗量 ' + healing + '</span>' +
      '</div>';
  }).join('');
  const infectionSummary = state.mode === 'infection' && state.infection?.metrics
    ? '<div class="infectionSettlementSummary">' +
        '<span>传播 ' + state.infection.metrics.applied + '</span>' +
        '<span>净化 ' + state.infection.metrics.cleansed + '</span>' +
        '<span>转化 ' + state.infection.metrics.transformed + '</span>' +
        '<span>感染流失 ' + state.infection.metrics.lifeLost + '</span>' +
        '<span>Boss 吸血 ' + state.infection.metrics.bossPassiveHeals + '</span>' +
        '<span>Boss 摸牌 ' + state.infection.metrics.bossPassiveDraws + '</span>' +
        '<span>感染牌 ' + state.infection.metrics.infectionCardsPlayed + '</span>' +
        '<span>抵消 ' + state.infection.metrics.infectionCardsCountered + '</span>' +
      '</div>'
    : '';
  return '<div class="settlementTable">' +
    '<div class="settlementRow header"><strong>角色</strong><span>造成伤害</span><span>承受伤害</span><span>治疗量</span></div>' +
    rows +
    infectionSummary +
    '</div>';
}

function renderGameOverOverlay() {
  if (!state?.winnerTeamId) return '';
  const viewer = localHumanPlayer() || state.players[0];
  const winnerFaction = state.infection?.winnerFactionId;
  const viewerWon = state.mode === 'infection'
    ? viewer?.factionId === winnerFaction
    : viewer?.teamId === state.winnerTeamId;
  const outcome = viewerWon ? '胜利' : '失败';
  const className = viewerWon ? 'victory' : 'defeat';
  const body = settlementStatsExpanded
    ? renderSettlementStats()
    : state.mode === 'infection'
      ? '<p>你的阵营：' + (viewer?.factionId === 'infected' ? '感染者' : '幸存者') +
        '；胜利阵营：' + (winnerFaction === 'infected' ? '感染者' : '幸存者') + '。</p>'
      : '<p>你的阵营：' + safeText(viewer?.teamId || '未知') + ' 队；胜利队伍：' + safeText(state.winnerTeamId) + ' 队。</p>';
  const confirmButton = settlementStatsExpanded ? '' : '<button class="confirm" onclick="showSettlementStats()">确认</button>';
  return '<div class="gameOverBackdrop" role="presentation">' +
    '<div class="gameOverOverlay ' + className + '" role="dialog" aria-modal="true" aria-labelledby="gameOverTitle">' +
      '<h2 id="gameOverTitle">' + outcome + '</h2>' +
      body +
      '<div class="gameOverActions">' + confirmButton + '<button onclick="exitToCleanStart()">退出</button></div>' +
    '</div>' +
  '</div>';
}

function renderZodiacMat(source, target, active) {
  return '<div class="zodiacMat">' +
    renderSetupPause(active) +
    renderMulliganCountdown() +
    renderPlayedCards() +
    '<div class="playSlots">' +
      '<div class="playSlot">星位</div>' +
      '<div class="playSlot">太阳</div>' +
      '<div class="playSlot">战区</div>' +
      '<div class="playSlot">月亮</div>' +
      '<div class="playSlot">命运</div>' +
    '</div>' +
    '<div class="duelLine"><div class="attackBeam"></div></div>' +
  '</div>';
}

function renderLegacyTargetPicker(active) {
  if (!active || state.phase !== 'main') return '';
  const enemies = enemiesOf(active);
  if (enemies.length === 0) return '';
  const selected = selectedEnemyOf(active);
  const buttons = enemies.map(enemy => {
    const visual = characterVisual(enemy);
    const selectedClass = selected?.id === enemy.id ? ' selected' : '';
    const lowHpClass = enemy.hp <= 1 ? ' lowHp' : '';
    return '<button class="legacyTargetButton ' + visual.className + selectedClass + lowHpClass + '" onclick="setTarget(\'' + active.id + '\', \'enemy\', \'' + enemy.id + '\')">' +
      '<span>敌方目标</span>' +
      '<strong>' + safeText(enemy.name) + ' · ' + safeText(visual.name) + '</strong>' +
      '<small>生命 ' + enemy.hp + '/' + enemy.maxHp + ' · 状态 ' + safeText(statuses(enemy)) + '</small>' +
      '</button>';
  }).join('');
  return '<div class="legacyTargetPicker">' +
    '<div class="legacyTargetHeader"><span>选择攻击目标</span><small>可选择任一存活敌人，不限默认目标</small></div>' +
    '<div class="legacyTargetChoices">' + buttons + '</div>' +
    '</div>';
}

function renderStageStats() {
  const infectionStats = state.mode === 'infection'
    ? '<span>潜伏感染 ' + state.players.filter(player => player.factionId === 'survivor' && player.infected && !player.eliminated).length + '</span>' +
      '<span>转化 ' + (state.infection?.metrics?.transformed || 0) + '</span>'
    : '';
  return '<div class="stageStats">' +
    '<span>牌堆 ' + state.deck.length + '</span>' +
    '<span>弃牌堆 ' + state.discard.length + '</span>' +
    '<span>额外回合 ' + state.metrics.extraTurns + '</span>' +
    '<span>状态命中 ' + state.metrics.statusesApplied + '</span>' +
    infectionStats +
    '</div>';
}

function renderSetupPause(active) {
  if (!setupPaused || !active) return '';
  const visual = characterVisual(active);
  const orderedPlayers = state.mulliganPendingPlayerIds
    .map((id) => state.players.find((player) => player.id === id))
    .filter(Boolean);
  const order = orderedPlayers.map((player) => characterVisual(player).name).join(' → ');
  const seatOrder = [...state.players].sort((left, right) => left.seatIndex - right.seatIndex);
  const activeIndex = seatOrder.findIndex((player) => player.id === active.id);
  const activeAngle = -90 + activeIndex * (360 / seatOrder.length);
  const pointerAngle = activeAngle + 90;
  const wheelSeats = seatOrder.map((player, index) => {
    const angle = (-90 + index * (360 / seatOrder.length)) * Math.PI / 180;
    const left = 50 + Math.cos(angle) * 40;
    const top = 50 + Math.sin(angle) * 40;
    const selectedClass = player.id === active.id ? ' selected' : '';
    return '<span class="openingWheelSeat' + selectedClass + '" style="--seat-left:' + left.toFixed(2) + '%;--seat-top:' + top.toFixed(2) + '%">' +
      safeText(characterVisual(player).name) +
    '</span>';
  }).join('');
  const fate = state.openingFate;
  const fateCard = fate?.card;
  const recipient = fate ? state.players.find((player) => player.id === fate.recipientId) : null;
  const directionText = state.turnDirection === -1 ? '逆时针' : '顺时针';
  const fateCardHtml = setupFateDrawn && fateCard
    ? '<div class="openingFateCard">' +
        assetImageHtml('openingFateArt', cardAssetUrls(fateCard), fateCard.name) +
        '<span>' + safeText(fateCard.name) + '</span>' +
      '</div>'
    : '<div class="openingFateCard cardBack">' +
        assetImageHtml('openingFateArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '命运牌背面') +
        '<span>命运牌</span>' +
      '</div>';
  const boss = state.mode === 'infection'
    ? state.players.find(player => player.id === state.infection?.bossPlayerId)
    : null;
  const fateSummaryHtml = setupFateDrawn
    ? '<span>命运牌决定 <b>' + directionText + '</b> 行动</span>' +
      '<span>末位 <b>' + safeText(recipient ? characterVisual(recipient).name : '未知') + '</b> 获得该命运牌</span>' +
      '<span>行动顺序：' + safeText(order) + '</span>'
    : '<span>请由先手 <b>' + safeText(visual.name) + '</b> 抽取命运牌</span>' +
      '<span>太阳决定顺时针，月亮决定逆时针；翻牌前不显示行动方向</span>';
  const buttonText = !setupRevealReady
    ? '星盘旋转中...'
    : setupFateDrawn
      ? '确认结果，开始换牌'
      : '由' + visual.name + '抽命运牌';
  const buttonAction = setupFateDrawn ? 'confirmSetup()' : 'drawOpeningFate()';
  return '<div class="setupPause ' + (setupFateDrawn ? 'fateDrawn' : 'awaitingFate') + '">' +
    '<div class="openingWheelStage" aria-label="命运罗盘">' +
      assetImageHtml('openingWheelArt', ['/zodiac-war-playtest/assets/ui/fate-compass.png'], '命运罗盘') +
      '<div class="openingWheelRing"></div>' +
      '<div class="openingWheelPointer" style="--pointer-angle:' + pointerAngle.toFixed(2) + 'deg"></div>' +
      wheelSeats +
      '<div class="openingWheelCore">命运罗盘</div>' +
    '</div>' +
    '<div class="openingFatePanel">' +
      '<strong>' + (boss
        ? '月蚀感染揭晓：' + safeText(characterVisual(boss).name) + ' 为初始感染者并先手'
        : '星盘决定：' + safeText(visual.name) + ' 先手') + '</strong>' +
      fateCardHtml +
      '<div class="openingFateSummary">' + fateSummaryHtml + '</div>' +
      '<button id="confirmSetupButton" ' + (setupRevealReady ? '' : 'disabled') + ' onclick="' + buttonAction + '">' + safeText(buttonText) + '</button>' +
    '</div>' +
  '</div>';
}

function renderMulliganCountdown() {
  if (setupPaused || state.phase !== 'mulligan' || !mulliganDeadline) return '';
  const remaining = Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000));
  const pendingNames = state.mulliganPendingPlayerIds
    .map(id => state.players.find(player => player.id === id))
    .filter(Boolean)
    .map(player => characterVisual(player).name)
    .join(' / ');
  return '<div class="mulliganTimer"><strong>全员同时确认起手牌</strong><div><b id="mulliganTimerSeconds">' + remaining + '</b> 秒</div><small>时间到后，未操作角色默认保留起手。待确认：' + safeText(pendingNames || '无') + '</small></div>';
}

function renderEntrustButton() {
  const localPlayer = localHumanPlayer();
  if (!localPlayer || setupPaused || state.phase === 'gameOver') return '';
  const entrusted = localPlayer.control === 'ai';
  return '<button class="entrustControl primaryAction" aria-pressed="' + (entrusted ? 'true' : 'false') + '" onclick="toggleEntrust()">' +
    (entrusted ? '取消托管' : '托管') +
    '</button>';
}

function renderTableControls(active, activeOpponent, activeAlly, attackSource, defenseTarget, handFocus) {
  if (state.pendingSkillDecisions?.length) return '';
  const mulliganPlayer = handFocus || active;
  const canMulligan = !setupPaused && state.phase === 'mulligan' && mulliganPlayer && state.mulliganPendingPlayerIds.includes(mulliganPlayer.id);
  const isFocusedActionPlayer = !setupPaused && handFocus?.control === 'human' && active?.id === handFocus?.id;
  const phaseButtons = [];
  if (canMulligan) {
    phaseButtons.push('<button onclick="mulligan(false, \'' + (mulliganPlayer?.id || '') + '\')">保留起手牌</button>');
    phaseButtons.push('<button onclick="mulligan(true, \'' + (mulliganPlayer?.id || '') + '\')">更换起手牌</button>');
  }
  if (state.phase === 'draw' && isFocusedActionPlayer) {
    phaseButtons.push(isScorpioAmbushPending(active)
      ? '<button disabled>请先确认窥星</button>'
      : '<button onclick="drawPhase()">摸牌阶段</button>');
  }
  if (state.phase === 'main' && isFocusedActionPlayer) {
    const emptyHand = handFocus && Array.isArray(handFocus.hand) && handFocus.hand.length === 0;
    phaseButtons.push('<button' + (emptyHand ? ' class="endMainEmpty"' : '') + ' onclick="endMain()">结束出牌</button>');
  }
  if (state.phase === 'discard' && isFocusedActionPlayer) {
    phaseButtons.push('<button onclick="autoDiscard()">自动弃至体力</button>');
  }
  if (state.phase === 'infectionResponse' && state.infection?.pendingInfectionCard?.targetId === handFocus?.id) {
    phaseButtons.push('<button onclick="respondInfection(\'' + handFocus.id + '\')">不抵消感染</button>');
  }
  if (state.phase === 'rescue' && (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId === handFocus?.id) {
    phaseButtons.push('<button onclick="skipInfectionRescue(\'' + handFocus.id + '\')">放弃急救</button>');
  }
  if (state.phase === 'reward' && state.infection?.pendingReward?.playerId === handFocus?.id) {
    const canRewardHeal = handFocus.hp < handFocus.maxHp && !handFocus.infected;
    const canRewardCleanse = handFocus.infected || ['burn', 'frozen', 'blind', 'silence'].some(status => handFocus.statuses?.[status]);
    phaseButtons.push('<button onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'draw2\')">摸 2 张</button>');
    phaseButtons.push('<button ' + (canRewardHeal ? '' : 'disabled') + ' onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'heal1\')">回复 1 点</button>');
    phaseButtons.push('<button ' + (canRewardCleanse ? '' : 'disabled') + ' onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'cleanse\')">移除状态/感染</button>');
    phaseButtons.push('<button onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'elementCard\')">获得本元素牌</button>');
  }
  if (phaseButtons.length === 0) return '';
  const controlsClass = canMulligan ? 'stageHandControls table mulliganControls' : 'stageHandControls table';
  return '<div class="' + controlsClass + '">' + phaseButtons.join('') + '</div>';
}

function renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls = '', handFocus = null) {
  return window.TabletopV10.renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls, handFocus);
}

function renderLegacyBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls = '', handFocus = null) {
  const source = attackSource || active;
  const target = defenseTarget || activeOpponent || (source ? selectedEnemyOf(source) : null);
  const focus = handFocus || active;
  const prompt = active ? actionPrompt(active, activeOpponent, attackSource, defenseTarget) : '等待牌局开始';
  const focusHand = renderFocusedHand(focus, tableControls);
  const activeSkillPanel = renderActiveSkillPanel(focus);
  const pendingSkillPanel = renderPendingSkillDecisionPanel(focus);
  return '<section class="arena mode' + state.players.length + ' ' + (latestEffect ? 'animating' : '') + '">' +
    '<svg id="actionGuideLayer" aria-hidden="true"><g id="actionGuideBeams"></g></svg>' +
    '<div class="arenaTopBar"><div class="arenaStatusLine"><button onclick="exitToCleanStart()">退出</button>' +
    renderEntrustButton() +
    renderStageLogPanel() +
    '<div class="stagePrompt">' + safeText(formatLogMessage(prompt)) + '</div></div>' + renderStageStats() + '</div>' +
    '<div class="battleStage">' +
    renderZodiacMat(source, target, active) +
    renderTableSeatRing(active, focus) +
    (pendingSkillPanel ? '<div class="skillActionOverlay">' + pendingSkillPanel + '</div>' : activeSkillPanel ? '<div class="skillActionOverlay">' + activeSkillPanel + '</div>' : '') +
    '</div>' +
    '<div class="stageHand"><div class="stageHandLayout"><div class="stageHandMain">' + focusHand + '</div><div class="focusCharacterDock">' + renderFocusedSkillActions(focus) + renderFocusCard(focus) + '</div></div></div>' +
    renderPlayerInspector() +
    renderSeatSkillTip() +
    '<div id="effectLayer"></div>' +
    '</section>';
}

function canClickHandCard(player, card, canAct, canRespond, canHammerBreak) {
  if (selectedSkills[player.id] === 'capricorn.charge' && capricornChargeDrafts[player.id]) return false;
  if (shouldPlayCardAsRescue(player, card, dyingRescueTargetOf(player))) return true;
  if (canRespond) return canUseDefenseCard(player, card);
  if (canHammerBreak) return true;
  if (canAmplifyPendingAttackWithMoon(player, card)) return true;
  if (!canAct) return false;
  if (isBasicAttackCard(card) && !canPlayMoreBasicAttacks(player)) return false;
  if (!player.statuses?.frozen) return true;
  return card.kind !== 'normalAttack' && card.kind !== 'statusAttack' && card.kind !== 'aoe';
}

function stealTargetsOf(player) {
  if (!player) return [];
  const targets = player.hand.map(card => ({ card, source: '手牌' }));
  if (player.equipment.weapon) targets.push({ card: player.equipment.weapon, source: '武器' });
  if (player.equipment.armor) targets.push({ card: player.equipment.armor, source: '防具' });
  return targets;
}

function defaultGeminiStealCostIds(player) {
  const air = player.hand.find(card => card.element === 'air');
  const other = player.hand.find(card => card.id !== air?.id);
  return air && other ? [air.id, other.id] : player.hand.slice(0, 2).map(card => card.id);
}

function enemiesOf(player) {
  if (state.mode === 'infection') {
    return state.players.filter(candidate => candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated);
  }
  return state.players.filter(candidate => candidate.teamId !== player.teamId && candidate.hp > 0);
}

function alliesOf(player) {
  if (state.mode === 'infection') {
    return state.players.filter(candidate => candidate.factionId === player.factionId && candidate.hp > 0 && !candidate.eliminated);
  }
  return state.players.filter(candidate => candidate.teamId === player.teamId && candidate.hp > 0);
}

function dyingRescueTargetOf(player) {
  if (!state || !player) return null;
  if (state.pendingRescue) return state.players.find(candidate => candidate.id === state.pendingRescue.targetId) || null;
  if (state.mode === 'infection') {
    const pending = (state.pendingRescue || state.infection?.pendingDying);
    if (!pending) return null;
    return state.players.find(candidate =>
      candidate.id === pending.targetId && candidate.hp <= 0 && !candidate.eliminated
    ) || null;
  }
  if (state.winnerTeamId || state.winnerId) return null;
  const dying = state.players.filter(candidate => candidate.hp <= 0 && !candidate.eliminated);
  return dying.find(candidate => candidate.teamId === player.teamId) || dying[0] || null;
}

function isOrdinaryRescueBlocked(target) {
  return Boolean(target?.statuses?.burn && state.players.some(candidate => candidate.characterId === 'leo' && candidate.hp > 0 && !candidate.eliminated));
}

function canReceiveOrdinaryHealing(target) {
  return Boolean(target && target.hp > 0 && !target.eliminated && target.hp < target.maxHp && !isOrdinaryRescueBlocked(target) &&
    !(state.mode === 'infection' && (target.infected || target.factionId === 'infected')));
}

function canUseRescueCard(player, card) {
  const legalKind = state.mode === 'infection' ? card.kind === 'sun' : card.kind === 'sun' || card.kind === 'energy';
  const target = dyingRescueTargetOf(player);
  return legalKind && Boolean(target) && !player.eliminated && (card.kind === 'sun' || !isOrdinaryRescueBlocked(target));
}

function shouldPlayCardAsRescue(player, card, target) {
  if (!player || !card || !target) return false;
  if (card.kind !== 'sun' && card.kind !== 'energy') return false;
  if (target.hp > 0) return false;
  const isOwnMainTurn = state.phase === 'main' && state.activePlayerId === player.id;
  if (isOwnMainTurn) return false;
  return true;
}

function canAmplifyPendingAttackWithMoon(player, card) {
  return Boolean(
    player &&
    card?.kind === 'moon' &&
    state.phase === 'response' &&
    state.pendingAttack &&
    state.pendingAttack.sourceId === player.id &&
    !state.pendingAttack.moonAmplifiedTargetId
  );
}

function isAriesRamCostCard(player, card, skillId) {
  if (!player || !card) return false;
  const isAttackCost = card.kind === 'normalAttack' || card.kind === 'statusAttack';
  if (!isAttackCost) return false;
  if (skillId === 'aries.ram') return card.element === 'fire';
  if (skillId === 'aries.burnSoul') return card.element !== 'fire' && !player.flags.usedAriesBurnSoul;
  return false;
}

function isAquariusMassHealCostCard(player, card) {
  if (!player || !card) return false;
  return player.hand.includes(card);
}

function activeSkillCostDraft(player) {
  if (!player || state.activePlayerId !== player.id || state.phase !== 'main') return null;
  const id = selectedSkills[player.id];
  if (!id || isSkillDisabled(player, id, !setupPaused)) return null;
  if (id === 'cancer.heal') {
    const validCardIds = player.hand.map(card => card.id);
    const costCardIds = (cancerHealDrafts[player.id]?.costCardIds || []).filter(id => validCardIds.includes(id)).slice(0, 1);
    cancerHealDrafts[player.id] = {costCardIds};
    return {skillId:id,skillName:'疗潮',costCardIds,validCardIds,ready:costCardIds.length === 1,requiresTarget:true,autoConfirm:false,
      hint:'先选择 1 张任意手牌作为费用，再点击一名可回复生命的受伤角色；可以选择自己。'};
  }
  if (id === 'scorpio.freezeAoe') {
    const validCardIds = player.hand.map(card => card.id);
    const costCardIds = [...new Set(scorpioPoisonDrafts[player.id]?.costCardIds || [])].filter(id => validCardIds.includes(id)).slice(0,2);
    scorpioPoisonDrafts[player.id] = {costCardIds};
    return {skillId:id,skillName:'蝎毒',costCardIds,validCardIds,ready:costCardIds.length === 2 && costCardIds.some(id => player.hand.find(card => card.id === id)?.element === 'water'),requiresTarget:true,autoConfirm:false,
      hint:'选择两张不同手牌：1 张水牌和 1 张任意牌（可再选水牌），再点击其他角色发动蝎毒。费用牌不会按普通出牌结算。'};
  }
  if (id === 'pisces.observeTide') {
    const costCardIds = (piscesObserveTideDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId));
    piscesObserveTideDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '观潮',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length > 0,
      requiresTarget: false,
      autoConfirm: false,
      hint: '点击要替换的手牌，数量不限；选好后点击“确认观潮”，弃几张摸几张。'
    };
  }
  if (id === 'aries.ram' || id === 'aries.burnSoul') {
    const costCardIds = (ariesRamDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId));
    ariesRamDrafts[player.id] = { costCardIds };
    const validCardIds = player.hand
      .filter(card => isAriesRamCostCard(player, card, id))
      .map(card => card.id);
    return {
      skillId: id,
      skillName: id === 'aries.burnSoul' ? '燃魂' : '金角冲',
      costCardIds,
      validCardIds,
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: id === 'aries.burnSoul'
        ? '点击 1 张非火普通攻击或状态攻击作为燃魂费用；选好后点击战场上的发光敌方目标释放。AOE、装备、功能、星能、太阳和月亮不能支付金角冲。'
        : '点击 1 张火普通攻击或状态攻击作为金角冲费用；选好后点击战场上的发光敌方目标释放。AOE、装备、功能、星能、太阳和月亮不能支付金角冲。'
    };
  }
  if (id === 'aquarius.massHeal') {
    const costCardIds = (aquariusMassHealDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    aquariusMassHealDrafts[player.id] = { costCardIds };
    const hasAir = costCardIds.some(cardId => player.hand.find(card => card.id === cardId)?.element === 'air');
    return {
      skillId: id,
      skillName: '神酿',
      costCardIds,
      validCardIds: player.hand.filter(card => isAquariusMassHealCostCard(player, card)).map(card => card.id),
      ready: costCardIds.length === 2 && hasAir,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 2 张高亮手牌作为费用，至少 1 张风牌。双风先回复自己 1 点生命，再献祭 1 点生命，最后全员回复 1 点；回复遵守普通恢复限制和生命上限。'
    };
  }
  if (id === 'weapon.waterCodex') {
    const costCardIds = (waterCodexDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    waterCodexDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '潮汐合成',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 2,
      requiresTarget: false,
      autoConfirm: false,
      hint: '点击任意 2 张高亮手牌作为素材，确认后生成 1 张本角色属性合成牌，再从手牌中正常使用。'
    };
  }
  if (id === 'leo.roar') {
    const stored = leoRoarDrafts[player.id] || { costCardIds: [], targetIds: [] };
    const costCardIds = stored.costCardIds
      .filter(cardId => player.hand.some(card => card.id === cardId && card.element === 'fire'))
      .slice(0, 1);
    const targetIds = [...new Set(stored.targetIds || [])]
      .filter(targetId => state.players.some(candidate =>
        candidate.id === targetId && candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated
      ))
      .slice(0, 3);
    leoRoarDrafts[player.id] = { costCardIds, targetIds };
    return {
      skillId: id,
      skillName: '狮吼',
      costCardIds,
      targetIds,
      validCardIds: player.hand.filter(card => card.element === 'fire').map(card => card.id),
      ready: costCardIds.length === 1 && targetIds.length >= 1 && targetIds.length <= 3,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张火牌作为费用，再依次点击 1–3 名其他存活角色；选好后再次点击“狮吼”发动。'
    };
  }
  if (id === 'leo.order') {
    const costCardIds = (leoOrderDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    leoOrderDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '兽王令',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张任意手牌作为兽王令费用；选好后点击战场上的目标角色。'
    };
  }
  if (id === 'taurus.armor') {
    const costCardIds = (taurusArmorDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    taurusArmorDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '筑甲',
      costCardIds,
      validCardIds: player.hand.filter(card => card.element === 'earth').map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 1 张土牌作为筑甲费用；选中后立即为自己叠 1 点护甲。'
    };
  }
  if (id === 'sagittarius.seekEquipment') {
    const costCardIds = (sagittariusSeekDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    sagittariusSeekDrafts[player.id] = { costCardIds };
    const hasFire = costCardIds.some(cardId => player.hand.find(card => card.id === cardId)?.element === 'fire');
    return {
      skillId: id,
      skillName: '寻器',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 2 && hasFire,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 2 张手牌，其中至少 1 张是火牌；若牌库没有装备，费用原样返还。'
    };
  }
  if (id === 'virgo.purify') {
    const costCardIds = (virgoPurifyDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    virgoPurifyDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '净化',
      costCardIds,
      validCardIds: player.hand.filter(card => card.element === 'earth').map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张土牌，再点击任一存活角色。感染模式中，感染目标优先移除感染。'
    };
  }
  return null;
}

function toggleSkillCostCard(playerId, cardId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  if (boardSkillHandDraft(player)) {toggleBoardSkillCost(playerId,cardId);openBoardSkillOptionsIfNeeded();return;}
  const draft = activeSkillCostDraft(player);
  if (!draft || !draft.validCardIds.includes(cardId)) return;
  if (draft.skillId === 'cancer.heal') {
    cancerHealDrafts[playerId] = {costCardIds:draft.costCardIds.includes(cardId) ? [] : [cardId]};
    render();
    return;
  }
  if (draft.skillId === 'scorpio.freezeAoe') {
    const selected = draft.costCardIds;
    scorpioPoisonDrafts[player.id] = {costCardIds:selected.includes(cardId) ? selected.filter(id => id !== cardId) : selected.length < 2 ? [...selected, cardId] : selected};
    render();
    return;
  }
  if (draft.skillId === 'pisces.observeTide') {
    const selected = draft.costCardIds;
    piscesObserveTideDrafts[player.id] = { costCardIds: selected.includes(cardId) ? selected.filter(id => id !== cardId) : [...selected, cardId] };
    render();
    return;
  }
  if (draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') {
    const costCardIds = draft.costCardIds.includes(cardId) ? [] : [cardId];
    ariesRamDrafts[player.id] = { costCardIds };
    render();
    return;
  }
  if (draft.skillId === 'leo.roar') {
    const costCardIds = draft.costCardIds.includes(cardId) ? [] : [cardId];
    leoRoarDrafts[player.id] = { costCardIds, targetIds: draft.targetIds || [] };
    render();
    return;
  }
  if (draft.skillId === 'taurus.armor') {
    taurusArmorDrafts[player.id] = { costCardIds: [cardId] };
    return confirmActiveSkillCost(player.id);
  }
  if (draft.skillId === 'aquarius.massHeal') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    aquariusMassHealDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready && nextDraft.autoConfirm) return confirmActiveSkillCost(player.id);
    render();
    return;
  }
  if (draft.skillId === 'weapon.waterCodex') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    waterCodexDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready && nextDraft.autoConfirm) return confirmActiveSkillCost(player.id);
    render();
    return;
  }
  if (draft.skillId === 'leo.order') {
    leoOrderDrafts[player.id] = { costCardIds: draft.costCardIds.includes(cardId) ? [] : [cardId] };
    render();
  }
  if (draft.skillId === 'sagittarius.seekEquipment') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    sagittariusSeekDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready) return confirmActiveSkillCost(player.id);
    render();
  }
  if (draft.skillId === 'virgo.purify') {
    virgoPurifyDrafts[player.id] = { costCardIds: draft.costCardIds.includes(cardId) ? [] : [cardId] };
    render();
  }
}

function cancelActiveSkillCost(playerId) {
  if (isScorpioAmbushPending(state.players.find(player => player.id === playerId))) return;
  delete scorpioPoisonDrafts[playerId];
  delete piscesObserveTideDrafts[playerId];
  delete ariesRamDrafts[playerId];
  delete leoRoarDrafts[playerId];
  delete capricornChargeDrafts[playerId];
  delete leoOrderDrafts[playerId];
  delete cancerHealDrafts[playerId];
  delete aquariusMassHealDrafts[playerId];
  delete waterCodexDrafts[playerId];
  delete taurusArmorDrafts[playerId];
  delete sagittariusSeekDrafts[playerId];
  delete virgoPurifyDrafts[playerId];
  delete selectedSkills[playerId];
  render();
}

function confirmActiveSkillCost(playerId, targetId = '') {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = activeSkillCostDraft(player);
  const opponent = player ? selectedEnemyOf(player) : null;
  const target = targetId ? state.players.find(candidate => candidate.id === targetId) : opponent;
  if (!player || !draft || !draft.ready) return;
  if (draft.skillId === 'cancer.heal') {
    if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
    delete cancerHealDrafts[playerId];
    delete selectedSkills[playerId];
    return action({type:'useSkill',playerId,skillId:'cancer.heal',targetId,cardIds:draft.costCardIds});
  }
  if (draft.skillId === 'scorpio.freezeAoe') {
    if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
    delete scorpioPoisonDrafts[playerId];
    delete selectedSkills[playerId];
    return action({type:'useSkill',playerId,skillId:draft.skillId,targetId,cardIds:draft.costCardIds});
  }
  if (draft.skillId === 'pisces.observeTide') {
    if (setupPaused || !isSkillUsable(player, draft.skillId, true)) return;
    delete piscesObserveTideDrafts[playerId];
    delete selectedSkills[playerId];
    return action({ type: 'useSkill', playerId, skillId: draft.skillId, cardIds: draft.costCardIds });
  }
  if ((draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') && target) {
    if (needsSkillDistanceCost(player, 'aries.ram', target)) {
      const distanceDraft = { type: 'useSkill', playerId, skillId: 'aries.ram', targetId: target.id, cardIds: draft.costCardIds };
      const candidates = distanceCostCandidates(player, distanceDraft);
      if (candidates.length === 0) {
        error = '跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
        render();
        return;
      }
      distanceCostDraft = distanceDraft;
      delete selectedSkills[playerId];
      render();
      return;
    }
    delete ariesRamDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'aries.ram',
      targetId: target.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'taurus.armor') {
    delete taurusArmorDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'taurus.armor',
      targetId: playerId,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'aquarius.massHeal') {
    delete aquariusMassHealDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'aquarius.massHeal',
      targetId: opponent?.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'weapon.waterCodex') {
    if (!canActivateEquipmentSkill(player, draft.skillId)) return;
    delete waterCodexDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'weapon.waterCodex',
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'leo.roar') {
    delete leoRoarDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'leo.roar',
      targetId: draft.targetIds[0],
      targetIds: draft.targetIds,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'leo.order' && target) {
    delete leoOrderDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'leo.order',
      targetId: target.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'sagittarius.seekEquipment') {
    delete sagittariusSeekDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'sagittarius.seekEquipment',
      targetId: playerId,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'virgo.purify' && target) {
    delete virgoPurifyDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'virgo.purify',
      targetId: target.id,
      option: state.mode === 'infection' && target.infected ? 'infection' : 'normal',
      cardIds: draft.costCardIds
    });
  }
}

function renderSkillCostBar(player) {
  const draft = activeSkillCostDraft(player);
  if (!draft) return '';
  const selectedCards = draft.costCardIds
    .map(cardId => player.hand.find(card => card.id === cardId))
    .filter(Boolean)
    .map(cardText)
    .join(' / ') || '未选择';
  const selectedTargets = draft.skillId === 'leo.roar'
    ? (draft.targetIds || [])
      .map(targetId => state.players.find(candidate => candidate.id === targetId))
      .filter(Boolean)
      .map(battleDisplayName)
      .join('、') || '未选择'
    : '';
  const isRoar = draft.skillId === 'leo.roar';
  const costLabel = draft.skillId === 'pisces.observeTide' ? '弃牌（' + draft.costCardIds.length + ' 张）：' : draft.skillId === 'weapon.waterCodex' ? '素材（' + draft.costCardIds.length + '/2）：' : '费用：';
  const hint = isRoar ? (draft.ready ? '再次点击狮吼发动；点已选角色可取消。' : draft.costCardIds.length ? '选择 1–3 名其他角色。' : '先选择 1 张火牌。') : draft.hint;
  return '<div class="skillCostBar' + (isRoar ? ' leoRoarCost' : '') + '">' +
    '<span><strong>' + safeText(draft.skillName) + '</strong>：' + safeText(hint) + '<br>' + costLabel + safeText(selectedCards) +
      (draft.skillId === 'leo.roar' ? '<br>目标：' + safeText(selectedTargets) + '（' + draft.targetIds.length + '/3）' : '') + '</span>' +
    '<div class="skillCostActions"><button onclick="cancelActiveSkillCost(\'' + player.id + '\')">取消技能</button></div>' +
    '</div>';
}

function selectedEnemyOf(player) {
  const enemies = enemiesOf(player);
  return enemies.find(candidate => targetDrafts[player.id]?.enemyId === candidate.id) || enemies[0];
}

function selectedAllyOf(player) {
  const allies = alliesOf(player);
  return allies.find(candidate => targetDrafts[player.id]?.allyId === candidate.id) || allies[0];
}

function setTarget(playerId, kind, targetId) {
  targetDrafts[playerId] = { ...(targetDrafts[playerId] || {}), [kind + 'Id']: targetId };
  render();
}

function selectEquipmentInfo(playerId, slot) {
  selectedEquipment[playerId] = slot;
  openPlayerInspector(playerId, 'equipment');
}

function beginEquipmentAction(playerId, skillId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || !canActivateEquipmentSkill(player, skillId)) return;
  inspectedPlayerId = '';
  skill(player, skillId);
}

function confirmAirCompass(playerId, element) {
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'weapon.airCompass',
    option: element
  });
}

function modeSeatCount(nextMode = currentMode()) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const modeConfig = clientGameModes[normalizedMode];
  const allowed = modeConfig.playerCounts || [modeConfig.seatCount];
  const inputCount = Number(document.getElementById('playerCount')?.value);
  const configuredCount = Number(config.playerCount);
  if (allowed.includes(inputCount)) return inputCount;
  if (allowed.includes(configuredCount)) return configuredCount;
  return allowed[0];
}

function currentMode() {
  if (config.mode === 'infection') return 'infection';
  return config.mode === 'standard' ? 'standard' : 'test';
}

function activeSeatIds(nextMode = currentMode()) {
  return allSeatIds.slice(0, modeSeatCount(nextMode));
}

function updateSeatControlVisibility() {
  const selectedMode = currentMode();
  const customCharacters = selectedMode === 'test';
  const activeIds = new Set(activeSeatIds());
  config.playerCount = activeIds.size;
  for (const id of allSeatIds) {
    const visible = activeIds.has(id);
    const seatConfig = document.getElementById('seat' + id + 'Config');
    if (seatConfig) seatConfig.style.display = visible ? '' : 'none';
    const characterSelect = document.getElementById('c' + id);
    const controlSelect = document.getElementById('m' + id);
    const randomCharacterNote = seatConfig?.querySelector('.randomCharacterNote');
    if (characterSelect) characterSelect.style.display = visible && customCharacters ? '' : 'none';
    if (controlSelect) controlSelect.style.display = visible ? '' : 'none';
    if (randomCharacterNote) randomCharacterNote.style.display = visible && !customCharacters ? 'flex' : 'none';
  }
  const playerCountField = document.getElementById('playerCountField');
  if (playerCountField) playerCountField.style.display = selectedMode === 'test' ? 'none' : '';
  const hint = document.getElementById('modeSettingHint');
  if (hint) {
    hint.textContent = selectedMode === 'test'
      ? '测试模式可配置每名玩家的星座与控制方式；进入牌桌后按黄道顺序生成座位。'
      : selectedMode === 'standard'
        ? '标准模式仅设置人数与真人/AI；本局星座由系统随机且不重复。'
        : '月蚀模式仅设置人数与真人/AI；初始感染者锁定摩羯，其余星座随机且不重复。';
  }
}

function setMode(nextMode) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const defaults = clientGameModes[normalizedMode];
  config.mode = normalizedMode;
  config.playerCount = defaults.playerCounts[0];
  config.characters = [...defaults.characters];
  config.controls = [...defaults.controls];
  render();
}

function syncStartControls() {
  config.mode = config.mode || (state.mode === 'infection' ? 'infection' : 'test');
  const current = currentMode();
  const modeInput = document.getElementById('mode');
  if (modeInput) modeInput.value = current;
  const playerCountInput = document.getElementById('playerCount');
  if (playerCountInput) {
    const allowed = clientGameModes[current].playerCounts || [clientGameModes[current].seatCount];
    const configuredCount = Number(config.playerCount || state.players.length || allowed[0]);
    const selectedCount = allowed.includes(configuredCount) ? configuredCount : allowed[0];
    playerCountInput.innerHTML = allowed
      .map(count => '<option value="' + count + '">' + count + ' 人</option>')
      .join('');
    playerCountInput.value = String(selectedCount);
    config.playerCount = selectedCount;
  }
  allSeatIds.forEach((id, index) => {
    const characterSelect = document.getElementById('c' + id);
    const controlSelect = document.getElementById('m' + id);
    if (characterSelect) characterSelect.value = config.characters[index] || clientGameModes[current].characters[index] || 'aries';
    if (controlSelect) controlSelect.value = config.controls[index] || clientGameModes[current].controls[index] || 'ai';
  });
  document.getElementById('startModeTest')?.classList.toggle('selected', current === 'test');
  document.getElementById('startModeStandard')?.classList.toggle('selected', current === 'standard');
  document.getElementById('startModeInfection')?.classList.toggle('selected', current === 'infection');
  updateSeatControlVisibility();
  window.ZodiacLobby?.sync();
}

async function api(path, body) {
  let json;
  try {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    json = await res.json();
  } catch (_error) {
    error = '本地服务连接失败：请刷新页面；如果仍失败，请重启游戏服务。';
    render();
    return;
  }
  previousState = path === '/api/tutorial' ? null : state ? JSON.parse(JSON.stringify(state)) : null;
  state = json.state;
  tutorial = json.tutorial || null;
  clientMatchId = json.matchId || clientMatchId;
  config = json.config || config;
  lobbyOpen = Boolean(json.lobbyOpen);
  localHumanPlayerId = json.localPlayerId || localHumanPlayerId;
  setupPaused = Boolean(json.setupPaused);
  setupFateDrawn = Boolean(json.setupFateDrawn);
  syncSetupReveal();
  mulliganDeadline = json.mulliganDeadline ?? null;
  actionDeadline = json.actionDeadline ?? null;
  actionStartedAt = json.actionStartedAt ?? null;
  if (path === '/api/restart' || path === '/api/exit' || state?.phase !== 'gameOver') settlementStatsExpanded = false;
  if (state?.phase !== 'mulligan') lastMulliganFocusId = '';
  error = json.error || '';
  latestEffect = setupPaused || lobbyOpen ? null : deriveLatestEffect();
  normalizeTransientSelections();
  render();
  window.ZodiacAudio?.syncSnapshot({state, matchId: clientMatchId, localPlayerId: localHumanPlayerId, lobbyOpen, setupPaused});
  playLatestEffectSound();
  if (path !== '/api/state') closeDebugPanel();
  if (path !== '/api/ai') {
    aiAdvanceDelayKey = '';
    aiAdvanceNotBefore = 0;
  }
  maybeAutoAdvanceAi();
}

function closeDebugPanel() {
  const panel = document.getElementById('debugPanel');
  if (panel) panel.open = false;
}

function action(body) { return api('/api/action', body); }
function tutorialCommand(command) {
  const lobbyConfig = command === 'start' ? { ...config,
    characters: allSeatIds.map(id => document.getElementById('c' + id)?.value),
    controls: allSeatIds.map(id => document.getElementById('m' + id)?.value) } : undefined;
  return api('/api/tutorial', { command, ...(lobbyConfig ? {lobbyConfig} : {}) });
}
function focusedMulliganPlayerId() {
  if (!state || state.phase !== 'mulligan') return state?.activePlayerId;
  const pending = state.mulliganPendingPlayerIds || [];
  const pendingHuman = pending
    .map(id => state.players.find(player => player.id === id))
    .find(player => player?.control === 'human');
  return pendingHuman?.id || pending[0] || state.activePlayerId;
}
function finishMulliganTimeout() {
  if (finishingMulliganTimeout || mulliganChoiceInFlight || !state || state.phase !== 'mulligan' || setupPaused) return;
  finishingMulliganTimeout = true;
  return api('/api/mulligan-timeout', {matchId: clientMatchId}).finally(() => {
    finishingMulliganTimeout = false;
  });
}
function finishActionTimeout() {
  if (finishingActionTimeout || !state || !actionDeadline || setupPaused) return;
  finishingActionTimeout = true;
  return api('/api/action-timeout', {}).finally(() => {
    finishingActionTimeout = false;
  });
}
function restart() {
  const selectedModeValue = document.getElementById('mode')?.value;
  const selectedMode = selectedModeValue === 'infection'
    ? 'infection'
    : selectedModeValue === 'standard'
      ? 'standard'
      : 'test';
  config.mode = selectedMode;
  const seatIds = activeSeatIds(selectedMode);
  const selectedControls = seatIds.map(id => document.getElementById('m' + id).value);
  if (!selectedControls.includes('human')) {
    error = '至少需要保留一个真人座位';
    render();
    return Promise.resolve();
  }
  return api('/api/restart', {
    mode: selectedMode,
    playerCount: modeSeatCount(selectedMode),
    characters: selectedMode === 'test'
      ? seatIds.map(id => document.getElementById('c' + id).value)
      : undefined,
    controls: selectedControls
  });
}
function restartDemo(nextMode = currentMode()) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const defaults = clientGameModes[normalizedMode];
  const nextPlayerCount = defaults.playerCounts[0];
  return api('/api/restart', {
    mode: normalizedMode,
    playerCount: nextPlayerCount,
    characters: normalizedMode === 'test' ? defaults.characters.slice(0, nextPlayerCount) : undefined,
    controls: defaults.controls.slice(0, nextPlayerCount)
  });
}
function showSettlementStats() {
  settlementStatsExpanded = true;
  render();
}
function exitToCleanStart() {
  return window.TabletopV10.requestNavigation('exit');
}
function toggleEntrust() {
  return api('/api/toggle-entrust', {});
}
function syncSetupReveal() {
  const fateId = state?.openingFate?.card?.id || 'no-fate';
  const nextKey = setupPaused && state ? state.seed + ':' + state.startingPlayerId + ':' + fateId : '';
  if (!nextKey) {
    if (setupRevealTimer) clearTimeout(setupRevealTimer);
    setupRevealTimer = null;
    setupRevealKey = '';
    setupRevealReady = false;
    return;
  }
  if (nextKey === setupRevealKey) return;
  if (setupRevealTimer) clearTimeout(setupRevealTimer);
  setupRevealKey = nextKey;
  setupRevealReady = false;
  setupRevealTimer = setTimeout(() => {
    if (!setupPaused || setupRevealKey !== nextKey) return;
    setupRevealReady = true;
    const button = document.getElementById('confirmSetupButton');
    if (button) {
      button.disabled = false;
      const firstPlayer = state.players.find(player => player.id === state.startingPlayerId);
      button.textContent = setupFateDrawn
        ? '确认结果，开始换牌'
        : '由' + (firstPlayer ? characterVisual(firstPlayer).name : '先手玩家') + '抽命运牌';
    }
  }, 3000);
}
function confirmSetup() {
  if (!setupRevealReady || !setupFateDrawn) return;
  return api('/api/start', {});
}
function drawOpeningFate() {
  if (!setupRevealReady || setupFateDrawn) return;
  return api('/api/draw-opening-fate', {});
}
function advanceAi() { return api('/api/ai', {}); }
function autoDiscard() { return api('/api/auto-discard', {}); }

function normalizeTransientSelections() {
  if (selectedCard) {
    const player = state?.players.find(candidate => candidate.id === selectedCard.playerId);
    const cardExists = player?.hand.some(candidate => candidate.id === selectedCard.cardId);
    if (!player || !cardExists || state.phase !== 'main' || state.activePlayerId !== selectedCard.playerId) clearSelectedCard();
  }
  if (distanceCostDraft) {
    const player = state?.players.find(candidate => candidate.id === distanceCostDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === distanceCostDraft.targetId);
    const cardExists = distanceCostDraft.type === 'playCard'
      ? player?.hand.some(candidate => candidate.id === distanceCostDraft.cardId)
      : true;
    const costCardsStillExist = (distanceCostDraft.cardIds || []).every(cardId => player?.hand.some(card => card.id === cardId));
    if (!player || !target || !cardExists || !costCardsStillExist || state.phase !== 'main' || state.activePlayerId !== distanceCostDraft.playerId) {
      distanceCostDraft = null;
    }
  }
  if (leoOrderPaymentDraft) {
    const player = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === leoOrderPaymentDraft.cardId);
    const receiver = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.receiverId);
    const candidates = player ? leoOrderPaymentCandidates(player, leoOrderPaymentDraft.reservedCardIds || []) : [];
    if (!player || !target || !card || !receiver || candidates.length === 0 || state.phase !== 'main' || state.activePlayerId !== leoOrderPaymentDraft.playerId) {
      leoOrderPaymentDraft = null;
    }
  }
  if (waterStealDraft) {
    const player = state?.players.find(candidate => candidate.id === waterStealDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === waterStealDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === waterStealDraft.cardId);
    if (!player || !target || !card || state.phase !== 'main' || state.activePlayerId !== waterStealDraft.playerId || !needsWaterStealChoice(card, target)) {
      waterStealDraft = null;
    }
  }
  if (airDismantleDraft) {
    const player = state?.players.find(candidate => candidate.id === airDismantleDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === airDismantleDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === airDismantleDraft.cardId);
    if (!player || !target || !card || state.phase !== 'main' || state.activePlayerId !== airDismantleDraft.playerId || !needsAirDismantleChoice(card, target)) {
      airDismantleDraft = null;
    }
  }
  Object.keys(discardDrafts).forEach(playerId => {
    const player = state?.players.find(candidate => candidate.id === playerId);
    if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) {
      delete discardDrafts[playerId];
      return;
    }
    const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
    discardDrafts[playerId] = (discardDrafts[playerId] || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, required);
  });
}

function toggleDiscardCard(playerId, cardId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) return;
  const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const current = discardDrafts[playerId] || [];
  if (current.includes(cardId)) {
    discardDrafts[playerId] = current.filter(id => id !== cardId);
  } else if (current.length < required) {
    discardDrafts[playerId] = [...current, cardId];
  }
  render();
}

function clearDiscardSelection(playerId) {
  discardDrafts[playerId] = [];
  render();
}

function confirmDiscard(playerId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) return;
  const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const cardIds = (discardDrafts[playerId] || []).filter(cardId => player.hand.some(card => card.id === cardId));
  if (cardIds.length !== required) return;
  discardDrafts[playerId] = [];
  return action({ type: 'discard', playerId, cardIds });
}

function currentActionOwner() {
  if (!state || setupPaused) return null;
  if (state.phase === 'rescue') return state.players.find(player => player.id === (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId) || null;
  const skillDecision = state.pendingSkillDecisions?.[0];
  if (skillDecision) return state.players.find(player => player.id === skillDecision.playerId) || null;
  if (state.phase === 'gameOver' && !state.winnerTeamId) {
    return aiRescueReviewPlayer() || rescueReviewPlayer();
  }
  if (state.phase === 'response' && state.pendingAttack) {
    return state.players.find(player => player.id === state.pendingAttack.currentTargetId) || null;
  }
  if (state.phase === 'hammerBreak' && state.pendingAttack) {
    return state.players.find(player => player.id === state.pendingAttack.currentTargetId) || null;
  }
  return state.players.find(player => player.id === state.activePlayerId) || null;
}

function shouldAutoAdvanceAi() {
  if (!state || lobbyOpen || setupPaused || state.winnerTeamId || state.phase === 'mulligan') return false;
  const owner = currentActionOwner();
  return owner?.control === 'ai';
}

function aiAdvanceDelayKeyForState() {
  const owner = currentActionOwner();
  if (!state || !owner) return '';
  const pending = state.pendingAttack
    ? [state.pendingAttack.sourceId, state.pendingAttack.currentTargetId, state.pendingAttack.card.id, state.pendingAttack.hitsRemaining, state.pendingAttack.defensesRemaining, state.pendingAttack.remainingTargetIds.join(',')].join(':')
    : '';
  return [state.phase, owner.id, state.activePlayerId, state.round, state.metrics.turns, state.log.length, pending].join('|');
}

function aiAdvanceDelayForState() {
  const owner = currentActionOwner();
  // Entering an AI draw phase should feel continuous. The normal three-second
  // presentation pause still applies after the cards are drawn and before play.
  if (state?.phase === 'draw' && owner?.control === 'ai') return 0;
  return AI_ACTION_DELAY_MS;
}

function maybeAutoAdvanceAi() {
  if (tutorial) return;
  if (advancingAi) return;
  if (!shouldAutoAdvanceAi()) {
    aiAdvanceDelayKey = '';
    aiAdvanceNotBefore = 0;
    return;
  }
  if (Date.now() < aiAdvanceNotBefore) return;
  advancingAi = true;
  advanceAi().finally(() => {
    aiAdvanceDelayKey = aiAdvanceDelayKeyForState();
    aiAdvanceNotBefore = Date.now() + aiAdvanceDelayForState();
    advancingAi = false;
  });
}

function drawPhase() {
  if (isScorpioAmbushPending(state.players.find(player => player.id === state.activePlayerId))) return render();
  return action({ type: 'drawPhase' });
}
function mulligan(replace, playerId = focusedMulliganPlayerId()) {
  if (!playerId || mulliganChoiceInFlight || finishingMulliganTimeout || !state ||
      state.phase !== 'mulligan' || setupPaused || lobbyOpen || !state.mulliganPendingPlayerIds.includes(playerId)) return;
  if (mulliganDeadline && Date.now() >= mulliganDeadline) return finishMulliganTimeout();
  lastMulliganFocusId = playerId;
  mulliganChoiceInFlight = true;
  return action({ type: 'mulligan', playerId, replace, matchId: clientMatchId }).finally(() => {
    mulliganChoiceInFlight = false;
  });
}
function endMain() { return action({ type: 'endMain', playerId: state.activePlayerId }); }
function skipDefense(playerId) { return action({ type: 'skipDefense', playerId }); }
function defend(playerId, cardId) { return action({ type: 'defend', playerId, cardId }); }
function respondInfection(playerId, cardId = '') {
  return action({ type: 'respondInfection', playerId, ...(cardId ? { cardId } : {}) });
}
function skipInfectionRescue(playerId) { return action({ type: 'skipRescue', playerId }); }
function rescueWithCrabGuard(playerId, cardId) {
  const pending = state.pendingRescue || state.infection?.pendingDying;
  if (!pending || pending.currentResponderId !== playerId || isOrdinaryRescueBlocked(state.players.find(player => player.id === pending.targetId))) return;
  return action({type:'useSkill',playerId,skillId:'cancer.rescue',targetId:pending.targetId,cardIds:[cardId]});
}
function chooseInfectionReward(playerId, option) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const statusId = option === 'cleanse' && player?.infected ? 'infection' : undefined;
  return action({ type: 'chooseInfectionReward', playerId, option, ...(statusId ? { statusId } : {}) });
}
function chooseInfectionBossCommand(playerId, option) {
  delete selectedSkills[playerId];
  return action({ type: 'useSkill', playerId, skillId: 'infection.bossCommand', option });
}
function earthHammerBreak(playerId, cardId) { return action({ type: 'earthHammerBreak', playerId, cardId }); }
function skipEarthHammerBreak(playerId) { return action({ type: 'earthHammerBreak', playerId }); }
function play(playerId, card, targetId, extraCostCardId = '', selectedCardId = '', leoOrderPaymentCardId = '', targetIds = []) {
  const player = state.players.find(candidate => candidate.id === playerId);
  if (!player || !card) return;
  if (!leoOrderPaymentCardId && beginLeoOrderPaymentDraft(player, card, targetId, extraCostCardId, selectedCardId, targetIds)) return;
  const body = { type: 'playCard', playerId, cardId: card.id, targetId };
  if (targetIds.length > 0) body.targetIds = targetIds;
  if (extraCostCardId) body.extraCostCardId = extraCostCardId;
  if (leoOrderPaymentCardId) body.leoOrderPaymentCardId = leoOrderPaymentCardId;
  if (selectedCardId) body.selectedCardId = selectedCardId;
  if (card.kind === 'sun' || card.kind === 'energy') {
    const target = state.players.find(player => player.id === targetId);
    if (shouldPlayCardAsRescue(player, card, target)) body.mode = 'rescue';
    else if (card.kind === 'sun') body.mode = 'active';
  }
  if (card.kind === 'moon') body.mode = canAmplifyPendingAttackWithMoon(player, card) ? 'amplify' : 'curse';
  return action(body);
}

function cancelLeoOrderPayment() {
  leoOrderPaymentDraft = null;
  render();
}

function cancelDistanceCost() {
  distanceCostDraft = null;
  render();
}

function cancelWaterStealChoice() {
  waterStealDraft = null;
  render();
}

function chooseWaterStealTarget(playerId, selectedCardId) {
  const draft = waterStealDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === draft?.targetId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !target || !card || draft.playerId !== playerId) return;
  const candidates = waterStealTargets(target).map(item => item.id);
  if (!candidates.includes(selectedCardId)) return;
  if (!canWaterStealTarget(player, target)) {
    waterStealDraft = null;
    error = '潮汐窃取只能对距离 1 的目标使用。';
    render();
    return;
  }
  waterStealDraft = null;
  return play(player.id, card, target.id, '', selectedCardId);
}

function cancelAirDismantleChoice() {
  airDismantleDraft = null;
  render();
}

function chooseAirDismantleTarget(playerId, selectedCardId) {
  const draft = airDismantleDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === draft?.targetId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !target || !card || draft.playerId !== playerId) return;
  const candidates = airDismantleTargets(target).map(item => item.id);
  if (!candidates.includes(selectedCardId)) return;
  airDismantleDraft = null;
  return play(player.id, card, target.id, '', selectedCardId);
}

function payLeoOrderPaymentCard(playerId, cardId) {
  const draft = leoOrderPaymentDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !card || draft.playerId !== playerId) return;
  const candidates = leoOrderPaymentCandidates(player, draft.reservedCardIds || []).map(candidate => candidate.id);
  if (!candidates.includes(cardId)) return;
  leoOrderPaymentDraft = null;
  return play(player.id, card, draft.targetId, draft.extraCostCardId || '', draft.selectedCardId || '', cardId, draft.targetIds || []);
}

function payDistanceCostCard(playerId, extraCostCardId) {
  const draft = distanceCostDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!draft || !player || draft.playerId !== playerId) return;
  const reserved = distanceCostCandidates(player, draft).map(card => card.id);
  if (!reserved.includes(extraCostCardId)) return;
  distanceCostDraft = null;
  if (draft.type === 'playCard') {
    const card = player.hand.find(candidate => candidate.id === draft.cardId);
    if (!card) return render();
    return play(player.id, card, draft.targetId, extraCostCardId, draft.selectedCardId || '');
  }
  if (draft.type === 'useSkill') {
    const body = {
      type: 'useSkill',
      playerId,
      skillId: draft.skillId,
      targetId: draft.targetId,
      cardIds: draft.cardIds,
      selectedCardId: draft.selectedCardId,
      extraCostCardId
    };
    delete selectedSkills[playerId];
    delete ariesRamDrafts[playerId];
    delete stealDrafts[playerId];
    return action(body);
  }
  render();
}

function scheduleSkillInfoAutoHide(playerId, id) {
  if (skillInfoAutoHideTimer) clearTimeout(skillInfoAutoHideTimer);
  skillInfoAutoHideTimer = null;
  if (!infoOnlySkills.has(id)) return;
  skillInfoAutoHideTimer = setTimeout(() => {
    if (selectedSkills[playerId] === id) {
      delete selectedSkills[playerId];
      skillInfoAutoHideTimer = null;
      render();
    }
  }, 2800);
}

function shouldConfirmBurnSoulRam(player, id) {
  if (!player) return false;
  return id === 'aries.ram' &&
    selectedSkills[player.id] === 'aries.burnSoul' &&
    Boolean(activeSkillCostDraft(player)?.ready);
}

function shouldKeepBurnSoulCostSelection(player, id) {
  if (!player) return false;
  return id === 'aries.ram' &&
    selectedSkills[player.id] === 'aries.burnSoul' &&
    !activeSkillCostDraft(player)?.ready;
}

function shouldConfirmLeoRoar(player, id) {
  return Boolean(
    player &&
    id === 'leo.roar' &&
    selectedSkills[player.id] === 'leo.roar' &&
    activeSkillCostDraft(player)?.ready
  );
}

function shouldKeepLeoRoarSelection(player, id) {
  return Boolean(player && id === 'leo.roar' && selectedSkills[player.id] === 'leo.roar');
}

function skill(player, id, event) {
  if (!player) return;
  if (id === 'cancer.heal' && selectedSkills[player.id] === id && activeSkillCostDraft(player)) { render(); return; }
  if (id === 'capricorn.charge' && selectedSkills[player.id] === id && capricornChargeDrafts[player.id]) { render(); return; }
  if (id === 'scorpio.freezeAoe' && selectedSkills[player.id] === id && activeSkillCostDraft(player)) { render(); return; }
  if (id === 'pisces.observeTide' && selectedSkills[player.id] === id && activeSkillCostDraft(player)) {
    render();
    return;
  }
  if (shouldConfirmBurnSoulRam(player, id)) return confirmActiveSkillCost(player.id);
  if (shouldKeepBurnSoulCostSelection(player, id)) {
    render();
    return;
  }
  if (shouldConfirmLeoRoar(player, id)) return confirmActiveSkillCost(player.id);
  if (shouldKeepLeoRoarSelection(player, id)) {
    render();
    return;
  }
  if (id === 'weapon.waterCodex' && selectedSkills[player.id] === id) {
    render();
    return;
  }
  selectedSkills[player.id] = id;
  scheduleSkillInfoAutoHide(player.id, id);
  const canUseMainSkill = state.activePlayerId === player.id && state.phase === 'main';
  const clickedSkillDisabled = !infoOnlySkills.has(id) && isSkillDisabled(player, id, canUseMainSkill);
  if (infoOnlySkills.has(id) || clickedSkillDisabled) {
    showSeatSkillTip(player.id, id, event, 'right');
    return;
  }
  if (selectedCard) clearSelectedCard();
  const opponent = selectedEnemyOf(player);
  const ally = selectedAllyOf(player);
  const first = player.hand[0];
  const earth = player.hand.find(c => c.element === 'earth');
  const water = player.hand.filter(c => c.element === 'water');
  if (id === 'pisces.observeTide') {
    piscesObserveTideDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'weapon.waterCodex') {
    if (skillInfoAutoHideTimer) clearTimeout(skillInfoAutoHideTimer);
    skillInfoAutoHideTimer = null;
    waterCodexDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'weapon.airCompass') {
    render();
    return;
  }
  if (id === 'aries.ram' || id === 'aries.burnSoul') {
    selectedSkills[player.id] = id;
    ariesRamDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'infection.bossCommand') {
    render();
    return;
  }
  if (id === 'gemini.steal') {
    const stealTargets = stealTargetsOf(opponent);
    stealDrafts[player.id] = {
      costCardIds: defaultGeminiStealCostIds(player),
      targetCardId: stealTargets[0]?.card.id || ''
    };
    render();
    return;
  }
  if (id === 'aquarius.massHeal') {
    aquariusMassHealDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'libra.harmony') {
    libraHarmonyDrafts[player.id] = { targetIds: [], costCardIds: [], selectedCardIds: [] };
    render();
    return;
  }
  if (id === 'pisces.balance') {
    piscesBalanceDrafts[player.id] = { targetIds: [], costCardIds: [] };
    render();
    return;
  }
  if (id === 'sagittarius.seekEquipment') {
    sagittariusSeekDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'virgo.purify') {
    virgoPurifyDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'scorpio.peek') {
    scorpioPeekDraft(player.id);
    render();
    return;
  }
  if (id === 'scorpio.spoils') {
    spoilsDrafts[player.id] = {costCardId:'',targetId:'',option:'',selectedCardId:''};
    render();
    return;
  }
  if (id === 'scorpio.freezeAoe') {
    scorpioPoisonDrafts[player.id] = {costCardIds:[]};
    render();
    return;
  }
  if (id === 'taurus.guard') {
    return action({ type: 'useSkill', playerId: player.id, skillId: id });
  }
  if (id === 'taurus.armor') {
    taurusArmorDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'leo.order') {
    leoOrderDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'leo.roar') {
    clearSelectedCard();
    leoRoarDrafts[player.id] = { costCardIds: [], targetIds: [] };
    render();
    return;
  }
  if (id === 'cancer.heal') {
    cancerHealDrafts[player.id] = {costCardIds:[]};
    render();
    return;
  }
  if (id === 'capricorn.charge') {
    if (skillInfoAutoHideTimer) clearTimeout(skillInfoAutoHideTimer);
    skillInfoAutoHideTimer = null;
    capricornChargeDrafts[player.id] = {option:player.rage >= 5 ? '' : 'single',targetIds:[],extraCostCardId:''};
    render();
    return;
  }
  render();
}

function setStealDraft(playerId, field, value) {
  stealDrafts[playerId] = { ...(stealDrafts[playerId] || {}), [field]: value };
  render();
}

function setAriesRamDraft(playerId, value) {
  ariesRamDrafts[playerId] = { ...(ariesRamDrafts[playerId] || {}), costCardId: value };
  render();
}

function setTaurusArmorDraft(playerId, field, value) {
  taurusArmorDrafts[playerId] = { ...(taurusArmorDrafts[playerId] || {}), [field]: value };
  render();
}

function confirmAriesRam(playerId) {
  const draft = ariesRamDrafts[playerId] || {};
  const player = state.players.find(p => p.id === playerId);
  const opponent = selectedEnemyOf(player);
  if (!draft.costCardId || !opponent) return;
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'aries.ram',
    targetId: opponent.id,
    cardIds: [draft.costCardId]
  });
}

function confirmTaurusArmor(playerId) {
  const draft = taurusArmorDrafts[playerId] || {};
  if (!draft.costCardId) return;
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'taurus.armor',
    targetId: playerId,
    cardIds: [draft.costCardId]
  });
}

function toggleStealCost(playerId, cardId) {
  const draft = stealDrafts[playerId] || {};
  const selected = draft.costCardIds || [];
  const costCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < 2
      ? [...selected, cardId]
      : [selected[1], cardId];
  stealDrafts[playerId] = { ...draft, costCardIds };
  render();
}

function confirmSteal(playerId) {
  const player = state.players.find(p => p.id === playerId);
  const opponent = selectedEnemyOf(player);
  if (!player || !opponent) return;
  const stealTargets = opponent ? stealTargetsOf(opponent) : [];
  const draft = stealDrafts[playerId] || {};
  const costCardIds = draft.costCardIds || [];
  const validCost = (costCardIds.length === 1 || costCardIds.length === 2)
    && new Set(costCardIds).size === costCardIds.length
    && costCardIds.every(id => player.hand.some(card => card.id === id));
  if (!validCost || (stealTargets.length > 0 && !draft.targetCardId)) return;
  delete selectedSkills[playerId];
  delete stealDrafts[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'gemini.steal',
    targetId: opponent.id,
    cardIds: costCardIds,
    selectedCardId: draft.targetCardId
  });
}

function aquariusChaliceEntries(player) {
  if (!player) return [];
  return player.hand.map(card => ({ card, source: '手牌' }));
}

function aquariusChaliceCanView(player, target) {
  return Boolean(player && target && (state.mode === 'infection' ? player.factionId === target.factionId : player.teamId === target.teamId));
}

function aquariusChaliceTakeIds(player, entry) {
  const target = state.players.find(candidate => candidate.id === entry.id);
  return aquariusChaliceCanView(player, target) ? (entry.takeCardIds || []) : (entry.giveCardIds || []).map(() => '');
}

function aquariusChaliceDraft(playerId) {
  const decision = state.pendingSkillDecisions?.[0];
  const decisionKey = clientMatchId + ':' + skillDecisionKey(decision) + ':' + (state.metrics.skillTriggers['aquarius.stormEye'] || 0);
  if (aquariusChaliceDrafts[playerId]?.decisionKey !== decisionKey) {
    aquariusChaliceDrafts[playerId] = { decisionKey, targets: [] };
  }
  return aquariusChaliceDrafts[playerId];
}

function toggleAquariusChaliceTarget(playerId, targetId) {
  const draft = aquariusChaliceDraft(playerId);
  const targets = draft.targets || [];
  const exists = targets.some(t => t.id === targetId);
  let nextTargets;
  if (exists) {
    nextTargets = targets.filter(t => t.id !== targetId);
  } else {
    if (targets.length >= 2) return; // 上限 2 名
    nextTargets = [...targets, { id: targetId, giveCardIds: [], takeCardIds: [] }];
  }
  aquariusChaliceDrafts[playerId] = { ...draft, targets: nextTargets };
  render();
}

function toggleAquariusChaliceGive(playerId, targetId, cardId) {
  const draft = aquariusChaliceDraft(playerId);
  const targets = (draft.targets || []).map(t => ({ ...t }));
  const entry = targets.find(t => t.id === targetId);
  if (!entry) return;
  if (targets.some(t => t.id !== targetId && (t.giveCardIds || []).includes(cardId))) return;
  const selected = entry.giveCardIds || [];
  const totalOther = targets.reduce((sum, t) => sum + (t.id === targetId ? 0 : (t.giveCardIds || []).length), 0);
  const giveCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : (selected.length + totalOther < 2 ? [...selected, cardId] : selected);
  const takeCardIds = (entry.takeCardIds || []).slice(0, giveCardIds.length);
  const updated = targets.map(t => t.id === targetId ? { ...t, giveCardIds, takeCardIds } : t);
  aquariusChaliceDrafts[playerId] = { ...draft, targets: updated };
  render();
}

function toggleAquariusChaliceTake(playerId, targetId, cardId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const target = state.players.find(candidate => candidate.id === targetId);
  if (!aquariusChaliceCanView(player, target) || !target.hand.some(card => card.id === cardId)) return;
  const draft = aquariusChaliceDraft(playerId);
  const targets = (draft.targets || []).map(t => ({ ...t }));
  const entry = targets.find(t => t.id === targetId);
  if (!entry) return;
  const giveLimit = Math.min((entry.giveCardIds || []).length, 2);
  const selected = entry.takeCardIds || [];
  const takeCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : (selected.length < giveLimit ? [...selected, cardId] : selected);
  const updated = targets.map(t => t.id === targetId ? { ...t, takeCardIds } : t);
  aquariusChaliceDrafts[playerId] = { ...draft, targets: updated };
  render();
}

function confirmAquariusChalice(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = aquariusChaliceDraft(playerId);
  const targets = draft.targets || [];
  if (aquariusChaliceInFlight || !player || state.pendingSkillDecisions?.[0]?.kind !== 'aquariusChalice' || state.pendingSkillDecisions[0].playerId !== playerId) return;
  const totalGive = targets.reduce((sum, t) => sum + (t.giveCardIds || []).length, 0);
  const totalTake = targets.reduce((sum, t) => sum + aquariusChaliceTakeIds(player, t).length, 0);
  if (totalGive < 1 || totalGive !== totalTake || totalGive > 2 || targets.length > 2) return;
  const targetIds = [];
  const cardIds = [];
  const selectedCardIds = [];
  for (const t of targets) {
    const g = t.giveCardIds || [];
    const target = state.players.find(candidate => candidate.id === t.id);
    const tk = aquariusChaliceTakeIds(player, t);
    if (!target || target.id === playerId || target.hp <= 0 || target.eliminated || g.length !== tk.length || tk.length > target.hand.length) return;
    if (g.some(id => !player.hand.some(card => card.id === id))) return;
    if (aquariusChaliceCanView(player, target) && (new Set(tk).size !== tk.length || tk.some(id => !target.hand.some(card => card.id === id)))) return;
    for (let i = 0; i < g.length; i += 1) {
      targetIds.push(t.id);
      cardIds.push(g[i]);
      selectedCardIds.push(tk[i]);
    }
  }
  if (new Set(cardIds).size !== cardIds.length) return;
  aquariusChaliceInFlight = true;
  render();
  // 倾杯已改为被动（受伤触发摸 2 牌）；此处只处理可选的换牌，通过技能决策提交。
  return action({
    type: 'resolveSkillDecision',
    playerId,
    activate: true,
    targetIds,
    cardIds,
    selectedCardIds
  }).finally(() => { aquariusChaliceInFlight = false; render(); });
}

function isScorpioAmbushPending(player) {
  return Boolean(player?.characterId === 'scorpio' && state.phase === 'draw' && state.activePlayerId === player.id && !player.flags.usedScorpioPeek);
}

function isScorpioEndPeekPending(player) {
  const decision = state.pendingSkillDecisions?.[0];
  return Boolean(player?.characterId === 'scorpio' && player.hp > 0 && !player.eliminated && state.phase === 'discard' && state.activePlayerId === player.id && decision?.kind === 'scorpioEndPeek' && decision.playerId === player.id);
}

function syncScorpioAmbush() {
  for (const player of state.players) {
    const ending = isScorpioEndPeekPending(player);
    if ((!isScorpioAmbushPending(player) && !ending) || player.control !== 'human' || setupPaused || lobbyOpen) {
      delete peekDrafts[player.id];
      if (selectedSkills[player.id] === 'scorpio.peek') delete selectedSkills[player.id];
      continue;
    }
    if (!ending) selectedSkills[player.id] = 'scorpio.peek';
    scorpioPeekDraft(player.id);
  }
}

function scorpioPeekDraft(playerId) {
  const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
  const ids = state.deck.slice(0,count).map(card => card.id);
  const stored = peekDrafts[playerId] || {topCardIds:ids,bottomCardIds:[]};
  const seen = new Set();
  const keep = list => (list || []).filter(id => { if (!ids.includes(id) || seen.has(id)) return false; seen.add(id); return true; });
  const topCardIds = keep(stored.topCardIds);
  const bottomCardIds = keep(stored.bottomCardIds);
  topCardIds.push(...ids.filter(id => !seen.has(id)));
  return peekDrafts[playerId] = {topCardIds,bottomCardIds};
}

function movePeekCard(playerId, cardId, destination) {
  const draft = scorpioPeekDraft(playerId);
  if (![...draft.topCardIds,...draft.bottomCardIds].includes(cardId)) return;
  const topCardIds = draft.topCardIds.filter(id => id !== cardId);
  const bottomCardIds = draft.bottomCardIds.filter(id => id !== cardId);
  if (destination === 'top') topCardIds.push(cardId);
  else bottomCardIds.push(cardId);
  peekDrafts[playerId] = { topCardIds, bottomCardIds };
  render();
}

function reorderPeekCard(playerId, cardId, group, direction) {
  const draft = scorpioPeekDraft(playerId);
  const list = [...draft[group + 'CardIds']];
  const index = list.indexOf(cardId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return;
  [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
  peekDrafts[playerId] = { ...draft, [group + 'CardIds']: list };
  render();
}

function scorpioPeekChoices(player, ending = false) {
  const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
  const draft = scorpioPeekDraft(player.id);
  const peeked = state.deck.slice(0, count);
  const byId = Object.fromEntries(peeked.map(card => [card.id, card]));
  const renderPeekCard = (cardId, group) => {
    const card = byId[cardId];
    if (!card) return '';
    const index = draft[group + 'CardIds'].indexOf(cardId);
    const lastIndex = draft[group + 'CardIds'].length - 1;
    const other = group === 'top' ? 'bottom' : 'top';
    const otherText = group === 'top' ? '放牌底' : '放牌顶';
    return '<div class="choiceStack"><button class="choiceCard selected">' + cardText(card) + '</button>' +
      '<div class="miniActions">' +
      '<button ' + (index <= 0 ? 'disabled' : '') + ' onclick="reorderPeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + group + '\', -1)">上移</button>' +
      '<button ' + (index >= lastIndex ? 'disabled' : '') + ' onclick="reorderPeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + group + '\', 1)">下移</button>' +
      '<button onclick="movePeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + other + '\')">' + otherText + '</button>' +
      '</div></div>';
  };
  const topCards = draft.topCardIds.map(cardId => renderPeekCard(cardId, 'top')).join('');
  const bottomCards = draft.bottomCardIds.length > 0
    ? draft.bottomCardIds.map(cardId => renderPeekCard(cardId, 'bottom')).join('')
    : '<div class="skillHint">暂无放入牌底的牌。</div>';
  const chooser = (ending ? '<div class="skillHint">回合结束保底窥星：只调整牌堆，不额外摸牌。</div>' : '') + '<div class="skillChooser">' +
    '<div class="skillHint">本次查看 ' + peeked.length + ' 张牌。' + (peeked.length === 0 ? (ending ? '牌堆为空，可直接确认结束回合。' : '牌堆为空，可直接确认后摸牌。') : '') + '</div>' +
    '<div><div class="chooserLabel">牌顶顺序</div><div class="choiceGrid">' + topCards + '</div></div>' +
    '<div><div class="chooserLabel">牌底顺序</div><div class="choiceGrid">' + bottomCards + '</div></div>' +
    '</div>';
  const actions = (ending ? '<button ' + (scorpioPeekInFlight ? 'disabled' : '') + ' onclick="resolvePendingSkillDecision(false)">不发动</button>' : '') + '<button ' + (scorpioPeekInFlight ? 'disabled' : '') + ' onclick="confirmScorpioPeek(\'' + player.id + '\')">确认窥星</button>';
  return {chooser, actions};
}

function confirmScorpioPeek(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const ending = isScorpioEndPeekPending(player);
  if (scorpioPeekInFlight || setupPaused || !player || player.characterId !== 'scorpio' || (!ending && !isSkillUsable(player, 'scorpio.peek', false))) return;
  const draft = scorpioPeekDraft(playerId);
  scorpioPeekInFlight = true;
  render();
  return action({
    type: ending ? 'resolveSkillDecision' : 'useSkill',
    playerId,
    ...(ending ? {activate:true} : {skillId:'scorpio.peek'}),
    topCardIds: draft.topCardIds,
    bottomCardIds: draft.bottomCardIds
  }).finally(() => { scorpioPeekInFlight = false; render(); });
}

function setSpoilsDraft(playerId, field, value) {
  if (scorpioDisarmInFlight || !['costCardId','targetId','option'].includes(field)) return;
  const draft = spoilsDrafts[playerId] || {};
  const player = state.players.find(player => player.id === playerId);
  spoilsDrafts[playerId] = { ...draft, [field]: field === 'costCardId' && draft.costCardId === value ? '' : value };
  if (field === 'targetId') Object.assign(spoilsDrafts[playerId],{option:'',selectedCardId:''});
  if (field === 'option') {
    const target = scorpioDisarmTargets(player).find(candidate => candidate.id === draft.targetId);
    const option = scorpioDisarmOptions(player,target).find(candidate => candidate.option === value);
    Object.assign(spoilsDrafts[playerId],{option:option?.option || '',selectedCardId:option?.selectedCardId || ''});
  }
  render();
}

function scorpioDisarmTargets(player) {
  return !player ? [] : state.players.filter(target => target.id !== player.id && target.hp > 0 && !target.eliminated && !player.flags.iceArmorBlockedTargetIds.includes(target.id));
}

function scorpioDisarmOptions(player, target) {
  if (!player || !target) return [];
  const options = [];
  if (target.armor > 0 && player.armor < player.maxArmor) options.push({option:'armor',label:'转移 1 点护甲'});
  if (target.statuses?.shield) options.push({option:'shield',label:'转移圣盾'});
  if (target.equipment.weapon) options.push({option:'weapon',selectedCardId:target.equipment.weapon.id,label:'夺取武器',card:target.equipment.weapon});
  if (target.equipment.armor) options.push({option:'armorEquipment',selectedCardId:target.equipment.armor.id,label:'夺取防具',card:target.equipment.armor});
  if (!target.armor && !target.statuses?.shield && !target.equipment.weapon && !target.equipment.armor) options.push({option:'damage',label:'造成 1 点普通伤害'});
  return options;
}

function confirmScorpioSpoils(playerId) {
  const draft = spoilsDrafts[playerId] || {};
  const player = state.players.find(p => p.id === playerId);
  if (scorpioDisarmInFlight || setupPaused || !player || !isSkillUsable(player, 'scorpio.spoils', state.activePlayerId === playerId && state.phase === 'main')) return;
  const target = scorpioDisarmTargets(player).find(target => target.id === draft.targetId);
  const option = scorpioDisarmOptions(player,target).find(option => option.option === draft.option && (!option.selectedCardId || option.selectedCardId === draft.selectedCardId));
  if (!option || !player.hand.some(card => card.id === draft.costCardId)) return;
  scorpioDisarmInFlight = true;
  render();
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'scorpio.spoils',
    targetId: draft.targetId,
    cardIds: [draft.costCardId],
    option: option.option,
    selectedCardId: option.selectedCardId
  }).finally(() => {
    if (state.players.find(player => player.id === playerId)?.flags.usedScorpioSting) {delete spoilsDrafts[playerId];delete selectedSkills[playerId];}
    scorpioDisarmInFlight=false;render();
  });
}

function isSkillDisabled(player, id, canAct) {
  if (!infoOnlySkills.has(id) && (player.hp <= 0 || player.eliminated)) return true;
  if (state.pendingSkillDecisions?.length && !infoOnlySkills.has(id)) return true;
  const canUseTurnStartSkill = state.activePlayerId === player.id && state.phase === 'draw';
  const silencedInOwnActionTurn = Boolean(player.statuses?.silence && state.activePlayerId === player.id);
  const ramCosts = player.hand.filter(card => card.kind === 'normalAttack' || card.kind === 'statusAttack');
  let disabled = false;
  if (infoOnlySkills.has(id)) disabled = false;
  else if (id === 'scorpio.peek') disabled = !canUseTurnStartSkill || player.flags.usedScorpioPeek;
  else if (id === 'taurus.guard') disabled = silencedInOwnActionTurn || !canUseTurnStartSkill || player.flags.taurusGuardSetupDone;
  else if (id === 'weapon.waterCodex') disabled = !canActivateEquipmentSkill(player, id);
  else if (id === 'weapon.airCompass') disabled = !canActivateEquipmentSkill(player, id);
  else if (id === 'infection.bossCommand') disabled = !isInitialInfectionBoss(player) || player.flags.usedInfectionBossCommand || silencedInOwnActionTurn || !canAct;
  else if (silencedInOwnActionTurn || !canAct) disabled = true;
  else if (id === 'cancer.heal') disabled = player.flags.usedCancerHeal || player.hand.length === 0 || !state.players.some(canReceiveOrdinaryHealing);
  else if (id === 'aries.ram') disabled = player.flags.usedAriesRam || !ramCosts.some(card => card.element === 'fire');
  else if (id === 'aries.burnSoul') disabled = player.flags.usedAriesRam || player.flags.usedAriesBurnSoul || !ramCosts.some(card => card.element !== 'fire');
  else if (id === 'aquarius.massHeal') {
    const air = player.hand.find(card => card.element === 'air');
    const other = player.hand.find(card => card.id !== air?.id);
    disabled = player.flags.usedAquariusMassHeal || !air || !other;
  }
  else if (id === 'gemini.steal') disabled = player.flags.usedGeminiSteal || player.hand.length === 0;
  else if (id === 'taurus.armor') disabled = player.flags.usedTaurusArmor || player.armor >= player.maxArmor || !player.hand.some(card => card.element === 'earth');
  else if (id === 'libra.harmony') {
    const others = state.players.filter(target => target.id !== player.id && target.hp > 0 && !target.eliminated);
    const airCount = player.hand.filter(card => card.element === 'air').length;
    disabled = player.flags.usedLibraHarmony || !others.some(first => others.some(second => {
      const difference = Math.abs(first.hand.length - second.hand.length);
      return first.id !== second.id && difference >= 2 && Math.floor(difference / 2) <= airCount;
    }));
  }
  else if (id === 'pisces.balance') {
    const living = state.players.filter(target => target.hp > 0 && !target.eliminated);
    const waterCount = player.hand.filter(card => card.element === 'water').length;
    disabled = player.flags.usedPiscesBalance || !living.some(first => living.some(second => first.id !== second.id && Math.abs(first.hp - second.hp) <= waterCount));
  }
  else if (id === 'pisces.observeTide') disabled = player.flags.usedPiscesObserveTide || player.hand.length === 0;
  else if (id === 'scorpio.freezeAoe') disabled = player.flags.usedScorpioPoison || player.hand.length < 2 || !player.hand.some(card => card.element === 'water') || !state.players.some(target => target.id !== player.id && target.hp > 0 && !target.eliminated && !player.flags.iceArmorBlockedTargetIds.includes(target.id));
  else if (id === 'scorpio.spoils') disabled = player.flags.usedScorpioSting || !player.hand.length || !scorpioDisarmTargets(player).some(target => scorpioDisarmOptions(player,target).length);
  else if (id === 'leo.roar') disabled = player.flags.usedLeoRoar || !player.hand.some(card => card.element === 'fire') || !state.players.some(target => target.id !== player.id && target.hp > 0 && !target.eliminated && !player.flags.iceArmorBlockedTargetIds.includes(target.id));
  else if (id === 'leo.order') disabled = player.flags.usedLeoOrder || player.hand.length === 0;
  else if (id === 'capricorn.charge') disabled = player.flags.usedCapricornChargeThisRound || player.rage < 1;
  else if (id === 'sagittarius.seekEquipment') {
    disabled = player.flags.usedSagittariusSeek || player.hand.length < 2 || !player.hand.some(card => card.element === 'fire');
  }
  else if (id === 'virgo.purify') {
    disabled = player.flags.usedVirgoPurify || !player.hand.some(card => card.element === 'earth');
  }
  return disabled;
}

function isSkillUsable(player, id, canAct) {
  return !infoOnlySkills.has(id) && !isSkillDisabled(player, id, canAct);
}

function skillButtons(player, canAct) {
  const map = {
    aries: [['aries.bloodRage', '金绒战意'], ['aries.ram', '金角冲'], ['aries.burnSoul', '燃魂']],
    leo: [['leo.aura', '狮威'], ['leo.roar', '狮吼'], ['leo.order', '兽王令']],
    gemini: [['gemini.windForm', '双生'], ['gemini.steal', '换影'], ['gemini.extraTurn', '连星']],
    libra: [['libra.elementSense', '衡感'], ['libra.judgment', '审判'], ['libra.harmony', '裁衡']],
    aquarius: [['aquarius.stormEye', '倾杯'], ['aquarius.massHeal', '神酿'], ['aquarius.windCut', '断流']],
    cancer: [['cancer.tideBond', '共潮'], ['cancer.heal', '疗潮'], ['cancer.rescue', '赫拉之护']],
    scorpio: [['scorpio.freezeAoe', '蝎毒'], ['scorpio.spoils', '缴械'], ['scorpio.peek', '窥星']],
    pisces: [['pisces.observeTide', '观潮'], ['pisces.balance', '双鱼之绊'], ['pisces.dream', '归潮']],
    taurus: [['taurus.guard', '护渡'], ['taurus.thickSkin', '神躯'], ['taurus.armor', '筑甲']],
    capricorn: [['capricorn.unyielding', '牧神怒'], ['capricorn.wushuang', '重压'], ['capricorn.charge', '山崩']],
    sagittarius: [['sagittarius.bowcraft', '整弓'], ['sagittarius.seekEquipment', '寻器'], ['sagittarius.sharpshot', '缪斯之弦']],
    virgo: [['virgo.purify', '净化'], ['virgo.domain', '净域'], ['virgo.discipline', '星律']]
  };
  const bossSkills = isInitialInfectionBoss(player)
    ? [['infection.bossDrain', '月蚀汲取'], ['infection.bossCommand', '蚀月战令'], ['infection.bossNoDistance', '月蚀领域']]
    : [];
  return [...(map[player.characterId] || []), ...bossSkills].map(([id, text]) => {
    const disabled = !infoOnlySkills.has(id) && isSkillDisabled(player, id, canAct);
    const selectedClass = selectedSkills[player.id] === id ? 'selected' : '';
    const usableClass = isSkillUsable(player, id, canAct) ? 'usableSkill' : '';
    const disabledClass = disabled ? 'disabledSkill' : '';
    const classes = [selectedClass, usableClass, disabledClass].filter(Boolean).join(' ');
    return '<button class="' + classes + '" aria-disabled="' + (disabled ? 'true' : 'false') + '" onclick="skill(state.players.find(p=>p.id===\'' + player.id + '\'), \'' + id + '\', event)">' + text + '</button>';
  }).join('');
}

function equipmentTraitButtons(player) {
  const buttons = [];
  const weapon = player?.equipment?.weapon;
  const armor = player?.equipment?.armor;
  if (weapon) {
    const actionId = weapon.element === 'water'
      ? 'weapon.waterCodex'
      : weapon.element === 'air'
        ? 'weapon.airCompass'
        : '';
    const label = actionId === 'weapon.waterCodex'
      ? '潮汐合成'
      : actionId === 'weapon.airCompass'
        ? '罗盘检索'
        : weapon.name;
    const usable = actionId && canActivateEquipmentSkill(player, actionId);
    const handler = usable
      ? 'beginEquipmentAction(\'' + player.id + '\', \'' + actionId + '\')'
      : 'selectEquipmentInfo(\'' + player.id + '\', \'weapon\')';
    buttons.push('<button class="equipmentTraitButton ' + (usable ? 'usableSkill' : 'disabledSkill') + '" aria-disabled="' + (!usable) + '" onclick="event.stopPropagation(); ' + handler + '">' + safeText(label) + '</button>');
  }
  if (armor) {
    buttons.push('<button class="equipmentTraitButton disabledSkill" aria-disabled="true" onclick="event.stopPropagation(); selectEquipmentInfo(\'' + player.id + '\', \'armor\')">' + safeText(armor.name) + '</button>');
  }
  return buttons.join('');
}

function toggleLibraHarmonyTarget(playerId, targetId) {
  const draft = libraHarmonyDrafts[playerId] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 2
      ? [...selected, targetId]
      : [selected[1], targetId];
  libraHarmonyDrafts[playerId] = { targetIds, costCardIds: [], selectedCardIds: [] };
  render();
}

function libraHarmonyRequirement(playerId) {
  const draft = libraHarmonyDrafts[playerId] || {};
  const targets = (draft.targetIds || []).map(id => state.players.find(player => player.id === id)).filter(Boolean);
  if (targets.length !== 2) return { targets, required: 0, richer: null, poorer: null, valid: false };
  const firstIsRicher = targets[0].hand.length >= targets[1].hand.length;
  const richer = firstIsRicher ? targets[0] : targets[1];
  const poorer = firstIsRicher ? targets[1] : targets[0];
  const difference = richer.hand.length - poorer.hand.length;
  return { targets, required: Math.floor(difference / 2), richer, poorer, valid: difference >= 2 };
}

function toggleLibraHarmonyCard(playerId, field, cardId) {
  const draft = libraHarmonyDrafts[playerId] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
  const required = libraHarmonyRequirement(playerId).required;
  const selected = draft[field] || [];
  const next = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < required
      ? [...selected, cardId]
      : required > 0
        ? [...selected.slice(1), cardId]
        : [];
  libraHarmonyDrafts[playerId] = { ...draft, [field]: next };
  render();
}

function confirmLibraHarmony(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = libraHarmonyDrafts[playerId] || {};
  const requirement = libraHarmonyRequirement(playerId);
  const costCardIds = draft.costCardIds || [];
  const selectedCardIds = draft.selectedCardIds || [];
  const validCosts = requirement.valid && costCardIds.length === requirement.required && costCardIds.every(cardId => player?.hand.some(card => card.id === cardId && card.element === 'air'));
  const validTransfers = requirement.valid && selectedCardIds.length === requirement.required && selectedCardIds.every(cardId => stealTargetsOf(requirement.richer).some(entry => entry.card.id === cardId));
  if (!player || !validCosts || !validTransfers) return;
  delete libraHarmonyDrafts[playerId];
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'libra.harmony',
    targetIds: draft.targetIds,
    cardIds: costCardIds,
    selectedCardIds
  });
}

function togglePiscesBalanceTarget(playerId, targetId) {
  const draft = piscesBalanceDrafts[playerId] || { targetIds: [], costCardIds: [] };
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 2
      ? [...selected, targetId]
      : [selected[1], targetId];
  piscesBalanceDrafts[playerId] = { targetIds, costCardIds: [] };
  render();
}

function piscesBalanceRequirement(playerId) {
  const draft = piscesBalanceDrafts[playerId] || {};
  const targets = (draft.targetIds || []).map(id => state.players.find(player => player.id === id)).filter(Boolean);
  return { targets, required: targets.length === 2 ? Math.abs(targets[0].hp - targets[1].hp) : 0 };
}

function togglePiscesBalanceCost(playerId, cardId) {
  const draft = piscesBalanceDrafts[playerId] || { targetIds: [], costCardIds: [] };
  const required = piscesBalanceRequirement(playerId).required;
  const selected = draft.costCardIds || [];
  const costCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < required
      ? [...selected, cardId]
      : required > 0
        ? [...selected.slice(1), cardId]
        : [];
  piscesBalanceDrafts[playerId] = { ...draft, costCardIds };
  render();
}

function confirmPiscesBalance(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = piscesBalanceDrafts[playerId] || {};
  const requirement = piscesBalanceRequirement(playerId);
  const costCardIds = draft.costCardIds || [];
  const valid = Boolean(player) && requirement.targets.length === 2 && costCardIds.length === requirement.required && costCardIds.every(cardId => player.hand.some(card => card.id === cardId && card.element === 'water'));
  if (!valid) return;
  delete piscesBalanceDrafts[playerId];
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'pisces.balance',
    targetIds: draft.targetIds,
    cardIds: costCardIds
  });
}

function capricornChargeDraft(player) {
  if (!player || player.characterId !== 'capricorn' || player.hp <= 0 || state.activePlayerId !== player.id || state.phase !== 'main' || player.statuses?.silence || player.flags.usedCapricornChargeThisRound || selectedSkills[player.id] !== 'capricorn.charge') return null;
  const stored = capricornChargeDrafts[player.id];
  if (!stored) return null;
  const option = player.rage >= 5 ? (['single','spread'].includes(stored.option) ? stored.option : '') : 'single';
  const maxTargets = option === 'spread' ? 3 : 1;
  const targets = state.players.filter(target => target.id !== player.id && target.hp > 0 && !target.eliminated);
  const targetIds = [...new Set(stored.targetIds || [])].filter(id => targets.some(target => target.id === id)).slice(0,maxTargets);
  const needsDistance = targets.some(target => targetIds.includes(target.id) && needsSkillDistanceCost(player,'capricorn.charge',target));
  const extraCostCardId = player.hand.find(card => card.id === stored.extraCostCardId)?.id || '';
  return {option,maxTargets,targets,targetIds,needsDistance,extraCostCardId,ready:player.rage >= 1 && Boolean(option && targetIds.length && (!needsDistance || extraCostCardId))};
}

function setCapricornChargeDraft(playerId, field, value) {
  if (capricornChargeInFlight || !['option','extraCostCardId'].includes(field)) return;
  const player = state.players.find(player => player.id === playerId);
  const draft = capricornChargeDraft(player);
  if (!draft) return;
  if (field === 'option' && (player.rage < 5 || !['single','spread'].includes(value))) return;
  if (field === 'extraCostCardId' && !player.hand.some(card => card.id === value)) return;
  capricornChargeDrafts[playerId] = {...capricornChargeDrafts[playerId],[field]:value};
  if (field === 'option') capricornChargeDrafts[playerId].targetIds = [];
  if (field === 'option' && boardSkillSelection()?.kind === 'capricorn.charge') boardSkillUI.stage='targets';
  render();
}

function toggleCapricornChargeTarget(playerId, targetId) {
  if (capricornChargeInFlight) return;
  const player = state.players.find(player => player.id === playerId);
  const draft = capricornChargeDraft(player);
  if (!draft?.option || !draft.targets.some(target => target.id === targetId)) return;
  let ids = draft.targetIds;
  if (ids.includes(targetId)) ids = ids.filter(id => id !== targetId);
  else if (draft.maxTargets === 1) ids = [targetId];
  else if (ids.length < draft.maxTargets) ids = [...ids,targetId];
  capricornChargeDrafts[playerId].targetIds = ids;
  render();
}

function confirmCapricornCharge(playerId) {
  if (capricornChargeInFlight) return;
  const player = state.players.find(player => player.id === playerId);
  const draft = capricornChargeDraft(player);
  if (!draft?.ready) return;
  capricornChargeInFlight = true;
  delete capricornChargeDrafts[playerId];
  delete selectedSkills[playerId];
  return action({type:'useSkill',playerId,skillId:'capricorn.charge',option:draft.option,targetId:draft.targetIds[0],targetIds:draft.targetIds,cardIds:[],...(draft.needsDistance ? {extraCostCardId:draft.extraCostCardId} : {})}).finally(() => {capricornChargeInFlight = false;render();});
}

function renderCapricornChargePanel(player, onBoard = false) {
  const draft = capricornChargeDraft(player);
  if (!draft) return '';
  const handler = (name,args) => safeText(name + '(' + args.map(value => JSON.stringify(value)).join(',') + ')');
  const button = (text,onclick,selected=false,disabled=false) => '<button class="choiceCard ' + (selected ? 'selected' : '') + '" ' + (disabled ? 'disabled ' : '') + 'onclick="' + onclick + '">' + safeText(text) + '</button>';
  const modes = player.rage >= 5 ? '<div class="chooserLabel">选择伤害分支</div><div class="choiceGrid">' +
    button('单体重击 · 1 名目标，2 点神圣伤害',handler('setCapricornChargeDraft',[player.id,'option','single']),draft.option === 'single') +
    button('分散打击 · 至多 3 名目标，每名 1 点伤害',handler('setCapricornChargeDraft',[player.id,'option','spread']),draft.option === 'spread') + '</div>' : '';
  const targets = draft.targets.map(target => button(characterVisual(target).name + ' · ' + (target.teamId === player.teamId ? '友' : '敌'),handler('toggleCapricornChargeTarget',[player.id,target.id]),draft.targetIds.includes(target.id),!draft.option || (draft.targetIds.length >= draft.maxTargets && draft.maxTargets > 1 && !draft.targetIds.includes(target.id)))).join('');
  const distance = draft.needsDistance ? '<div class="chooserLabel">跨距离：额外弃 1 张牌（本次发动支付一次）</div><div class="choiceGrid">' + player.hand.map(card => button(cardText(card),handler('setCapricornChargeDraft',[player.id,'extraCostCardId',card.id]),draft.extraCostCardId === card.id)).join('') + '</div>' : '';
  const choices = '<div class="skillHint">当前 ' + player.rage + ' 点怒气；发动将消耗全部怒气。' + (player.rage >= 5 ? '摩羯和所有选中目标弃全部手牌、装备。' : '') + '</div>' + modes +
    (onBoard ? '' : '<div class="chooserLabel">选择目标（' + draft.targetIds.length + '/' + draft.maxTargets + '）</div><div class="choiceGrid">' + targets + '</div>' + distance);
  const actions = '<button ' + (!draft.ready || capricornChargeInFlight ? 'disabled' : '') + ' onclick="' + handler('confirmCapricornCharge',[player.id]) + '">确认山崩</button>';
  return renderSkillChoiceContent('山崩',onBoard ? '' : skillDescriptions['capricorn.charge'].text,choices,onBoard ? '' : actions,player.id);
}

function skillInfo(player, onBoard = false) {
  const id = selectedSkills[player.id];
  if (!id || !skillDescriptions[id]) return '';
  const item = skillDescriptions[id];
  if (id === 'capricorn.charge') return renderCapricornChargePanel(player,onBoard);
  const opponent = selectedEnemyOf(player);
  let chooser = '';
  let actions = '';
  if (id === 'libra.harmony' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = libraHarmonyDrafts[player.id] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
    const candidates = state.players.filter(candidate => candidate.hp > 0 && candidate.id !== player.id);
    const targetOptions = candidates.map(candidate =>
      '<button class="choiceCard ' + ((draft.targetIds || []).includes(candidate.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + '</button>'
    ).join('');
    const requirement = libraHarmonyRequirement(player.id);
    const costOptions = player.hand.filter(card => card.element === 'air').map(card =>
      '<button class="choiceCard ' + ((draft.costCardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyCard(\'' + player.id + '\', \'costCardIds\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const transferOptions = requirement.richer ? stealTargetsOf(requirement.richer).map(entry =>
      '<button class="choiceCard ' + ((draft.selectedCardIds || []).includes(entry.card.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyCard(\'' + player.id + '\', \'selectedCardIds\', \'' + entry.card.id + '\')">' + safeText(entry.source) + '：' + cardText(entry.card) + '</button>'
    ).join('') : '';
    const ready = requirement.valid && (draft.costCardIds || []).length === requirement.required && (draft.selectedCardIds || []).length === requirement.required;
    chooser = '<div class="skillChooser">' +
      (onBoard ? '' : '<div class="chooserLabel">选择两名其他角色</div><div class="choiceGrid">' + targetOptions + '</div>') +
      (requirement.targets.length === 2 && !requirement.valid ? '<div class="skillHint">两名角色手牌差不足 2，不能发动裁衡。</div>' : '') +
      (requirement.valid ? (onBoard ? '' : '<div class="chooserLabel">弃置 ' + requirement.required + ' 张风牌</div><div class="choiceGrid">' + (costOptions || '<div class="skillHint">没有足够风牌。</div>') + '</div>') +
        '<div class="chooserLabel">从手牌较多的 ' + safeText(characterVisual(requirement.richer).name) + ' 处选择转移的 ' + requirement.required + ' 张牌或装备</div><div class="choiceGrid">' + transferOptions + '</div>' : '') +
      '</div>';
    actions = '<button ' + (!ready ? 'disabled' : '') + ' onclick="' + (onBoard ? 'confirmBoardSkillOptions()' : 'confirmLibraHarmony(\'' + player.id + '\')') + '">' + (onBoard ? '确定' : '发动裁衡') + '</button>';
  }
  if (id === 'pisces.balance' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = piscesBalanceDrafts[player.id] || { targetIds: [], costCardIds: [] };
    const candidates = state.players.filter(candidate => candidate.hp > 0);
    const targetOptions = candidates.map(candidate =>
      '<button class="choiceCard ' + ((draft.targetIds || []).includes(candidate.id) ? 'selected' : '') + '" onclick="togglePiscesBalanceTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 生命 ' + candidate.hp + '/' + candidate.maxHp + '</button>'
    ).join('');
    const requirement = piscesBalanceRequirement(player.id);
    const costOptions = player.hand.filter(card => card.element === 'water').map(card =>
      '<button class="choiceCard ' + ((draft.costCardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="togglePiscesBalanceCost(\'' + player.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const ready = requirement.targets.length === 2 && (draft.costCardIds || []).length === requirement.required;
    chooser = '<div class="skillChooser">' +
      '<div class="chooserLabel">选择任意两名存活角色</div><div class="choiceGrid">' + targetOptions + '</div>' +
      (requirement.targets.length === 2 ? '<div class="chooserLabel">弃置 ' + requirement.required + ' 张水牌</div><div class="choiceGrid">' + (requirement.required ? (costOptions || '<div class="skillHint">没有足够水牌。</div>') : '<div class="skillHint">生命相同，无需弃牌。</div>') + '</div>' : '') +
      '</div>';
    actions = '<button ' + (!ready ? 'disabled' : '') + ' onclick="confirmPiscesBalance(\'' + player.id + '\')">发动双鱼之绊</button>';
  }
  if (id === 'weapon.airCompass' && state.activePlayerId === player.id && state.phase === 'main') {
    const options = [
      ['fire', '火'],
      ['water', '水'],
      ['air', '风'],
      ['earth', '土']
    ].map(([element, label]) =>
      '<button class="choiceCard" onclick="confirmAirCompass(\'' + player.id + '\', \'' + element + '\')">获得 1 张' + label + '属性牌</button>'
    ).join('');
    chooser = '<div class="skillChooser"><div class="chooserLabel">选择要检索的属性</div><div class="choiceGrid">' + options + '</div></div>';
  }
  if (id === 'infection.bossCommand' && state.activePlayerId === player.id && state.phase === 'main') {
    chooser = '<div class="skillChooser">' +
      '<div class="chooserLabel">选择本回合的战令效果</div>' +
      '<div class="choiceGrid">' +
        '<button class="choiceCard" onclick="chooseInfectionBossCommand(\'' + player.id + '\', \'extraAttack\')"><strong>连袭</strong><span>本回合可额外使用 1 张基础攻击牌。</span></button>' +
        '<button class="choiceCard" onclick="chooseInfectionBossCommand(\'' + player.id + '\', \'extraTarget\')"><strong>扩袭</strong><span>本回合 1 张基础攻击牌可额外指定 1 个目标。</span></button>' +
      '</div>' +
    '</div>';
  }
  if (id === 'gemini.steal' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = stealDrafts[player.id] || {};
    const costCardIds = draft.costCardIds || [];
    const validStealCost = (costCardIds.length === 1 || costCardIds.length === 2)
      && new Set(costCardIds).size === costCardIds.length
      && costCardIds.every(cardId => player.hand.some(card => card.id === cardId));
    const stealTargets = opponent ? stealTargetsOf(opponent) : [];
    const ownOptions = player.hand.map(card =>
      '<button class="choiceCard ' + (costCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleStealCost(\'' + player.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const targetOptions = stealTargets.map(item =>
      '<button class="choiceCard ' + (draft.targetCardId === item.card.id ? 'selected' : '') + '" onclick="setStealDraft(\'' + player.id + '\', \'targetCardId\', \'' + item.card.id + '\')">' + item.source + '：' + cardText(item.card) + '</button>'
    ).join('');
    const targetChooser = stealTargets.length > 0
      ? '<div><div class="chooserLabel">选择对手手牌或装备</div><div class="choiceGrid">' + targetOptions + '</div></div>'
      : '<div class="skillHint">目标没有手牌和装备：发动后对目标造成 1 点伤害并附加致盲。</div>';
    chooser = '<div class="skillChooser">' +
      (onBoard ? '' : '<div><div class="chooserLabel">选择费用：弃 2 张牌，或弃 1 张牌并失去 1 点生命</div><div class="choiceGrid">' + ownOptions + '</div></div>') +
      '<div class="skillHint">选择 1 张费用牌时，发动后失去 1 点生命。换影无距离限制。</div>' +
      targetChooser +
      '</div>';
    actions = '<button ' + (!validStealCost || (stealTargets.length > 0 && !draft.targetCardId) ? 'disabled' : '') + ' onclick="' + (onBoard ? 'confirmBoardSkillOptions()' : 'confirmSteal(\'' + player.id + '\')') + '">' + (onBoard ? '确定' : '发动换影') + '</button>';
  }

  if (id === 'scorpio.peek' && isScorpioAmbushPending(player)) {
    const content = scorpioPeekChoices(player);
    chooser = content.chooser;
    actions = content.actions;
  }
  if (id === 'scorpio.spoils' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = spoilsDrafts[player.id] || {};
    const handler = (name,args) => safeText(name + '(' + args.map(value => JSON.stringify(value)).join(',') + ')');
    const choice = (field,value,label,selected) => '<button class="choiceCard ' + (selected ? 'selected' : '') + '" ' + (scorpioDisarmInFlight ? 'disabled ' : '') + 'onclick="' + handler('setSpoilsDraft',[player.id,field,value]) + '">' + label + '</button>';
    const targets = scorpioDisarmTargets(player);
    const target = targets.find(target => target.id === draft.targetId);
    const options = scorpioDisarmOptions(player,target);
    const costOptions = player.hand.map(card => choice('costCardId',card.id,cardText(card),draft.costCardId === card.id)).join('');
    const targetOptions = targets.map(target => choice('targetId',target.id,safeText(characterVisual(target).name),draft.targetId === target.id)).join('');
    const resourceOptions = options.map(option => choice('option',option.option,safeText(option.label) + (option.card ? ' · ' + safeText(option.card.name) : ''),draft.option === option.option)).join('');
    chooser = '<div class="skillChooser">' +
      (onBoard ? '' : '<div><div class="chooserLabel">选择弃置的 1 张手牌</div><div class="choiceGrid">' + costOptions + '</div></div>' +
      '<div><div class="chooserLabel">选择一名其他存活角色</div><div class="choiceGrid">' + targetOptions + '</div></div>') +
      (target ? '<div><div class="chooserLabel">选择一项转移资源</div><div class="choiceGrid">' + (resourceOptions || '<div class="skillHint">自身护甲已满，不能转移护甲，请选择其他目标。</div>') + '</div></div>' : '') +
      '<div class="skillHint">每次只转移一项。装备直接装备并正常替换；目标没有护甲、圣盾或装备时才造成伤害。</div>' +
      '</div>';
    const ready = player.hand.some(card => card.id === draft.costCardId) && options.some(option => option.option === draft.option && (!option.selectedCardId || option.selectedCardId === draft.selectedCardId));
    actions = '<button ' + (!ready || scorpioDisarmInFlight ? 'disabled' : '') + ' onclick="' + (onBoard ? 'confirmBoardSkillOptions()' : handler('confirmScorpioSpoils',[player.id])) + '">' + (onBoard ? '确定' : '发动缴械') + '</button>';
  }
  if (onBoard) actions='<button onclick="returnBoardSkillTargets()">重选目标</button>'+actions;
  return renderSkillChoiceContent(item.name, onBoard ? '' : item.text, chooser, actions, id === 'scorpio.peek' ? '' : player.id);
}

function syncHandStacking() {
  const hand = document.querySelector('.focusedHandCards');
  if (!hand) return;
  const cards = Array.from(hand.querySelectorAll('.card'));
  hand.classList.remove('stackedHand');
  hand.style.removeProperty('--hand-overlap');
  if (cards.length <= 1) return;
  const style = window.getComputedStyle(hand);
  const gap = Number.parseFloat(style.columnGap || style.gap || '0') || 0;
  const cardWidth = cards[0]?.getBoundingClientRect().width || 148;
  const horizontalPadding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);
  const handWidth = Math.max(0, hand.clientWidth - horizontalPadding);
  const cardsWidth = cards.length * cardWidth + Math.max(0, cards.length - 1) * gap;
  const needsStacking = cardsWidth > handWidth;
  hand.classList.toggle('stackedHand', needsStacking);
  if (needsStacking) {
    const availableStep = Math.max(0, (handWidth - cardWidth) / Math.max(1, cards.length - 1));
    const overlap = Math.max(0, Math.min(cardWidth - 6, cardWidth + gap - availableStep));
    hand.style.setProperty('--hand-overlap', overlap.toFixed(2) + 'px');
  }
}

function render() {
  if (!state) return;
  const skillPanelView = window.TabletopV10?.captureSkillPanelView();
  syncScorpioAmbush();
  syncStartControls();
  document.documentElement.classList.toggle('matchOpen', !lobbyOpen);
  document.body.classList.toggle('matchOpen', !lobbyOpen);
  const startScreen = document.getElementById('startScreen');
  const board = document.getElementById('board');
  document.body.classList.toggle('tutorialOpen', Boolean(tutorial));
  document.getElementById('error').innerHTML = error ? '<div class="error">' + error + '</div>' : '';
  if (lobbyOpen) {
    window.TabletopV10?.syncSettingsPanel();
    document.getElementById('subtitle').textContent = '选择模式与席位配置';
    document.getElementById('winner').innerHTML = '';
    startScreen.hidden = false;
    board.hidden = true;
    board.innerHTML = '';
    window.GameI18n?.localize(document.body);
    return;
  }
  window.ZodiacLobby?.closeForMatch();
  startScreen.hidden = true;
  board.hidden = false;
  const active = state.players.find(p => p.id === state.activePlayerId);
  document.getElementById('subtitle').textContent = '阶段：' + state.phase + ' · 第 ' + state.round + ' 轮 · 行动者：' + (active ? characterVisual(active).name : '等待');
  document.getElementById('winner').innerHTML = renderGameOverOverlay();
  const localPlayer = localHumanPlayer();
  const entrustButton = document.getElementById('entrustButton');
  if (entrustButton) {
    const entrusted = localPlayer?.control === 'ai';
    entrustButton.textContent = entrusted ? '取消托管' : '托管';
    entrustButton.setAttribute('aria-pressed', entrusted ? 'true' : 'false');
  }
  const activeOpponent = active ? selectedEnemyOf(active) : null;
  const activeAlly = active ? selectedAllyOf(active) : null;
  const attackSource = state.pendingAttack ? state.players.find(player => player.id === state.pendingAttack.sourceId) : null;
  const defenseTarget = state.pendingAttack ? state.players.find(player => player.id === state.pendingAttack.currentTargetId) : null;
  const handFocus = focusedHumanPlayer(active, attackSource, defenseTarget);
  const tableControls = renderTableControls(active, activeOpponent, activeAlly, attackSource, defenseTarget, handFocus);
  board.innerHTML = renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls, handFocus);
  window.TabletopV10?.restoreSkillPanelView(skillPanelView);
  requestAnimationFrame(() => {
    updatePersistentActionGuide();
    syncHandStacking();
  });

  const visibleLog = setupPaused && !setupFateDrawn
    ? state.log.filter(event => !event.message.includes('命运牌'))
    : state.log;
  const logSummary = document.getElementById('logSummary');
  if (logSummary) {
    logSummary.textContent = visibleLog.slice(0, 3).map(e => localizedLogMessage(e)).join(' / ') || '暂无日志';
  }
  document.getElementById('log').innerHTML = visibleLog.slice(0, 80).map(e => '<div>' + safeText(localizedLogMessage(e)) + '</div>').join('');
  window.GameI18n?.localize(document.body);
  window.ZodiacTutorial?.sync(tutorial);
}

function setupSelectors() {
  for (const id of allSeatIds.map(value => 'c' + value)) {
    const el = document.getElementById(id);
    el.innerHTML = Object.entries(labels).map(([value, text]) => '<option value="' + value + '">' + text + '</option>').join('');
  }
}

function downloadLog() {
  const displayLog = state.log.map(event => ({ ...event, message: formatLogMessage(event.message) }));
  if (window.GameI18n) displayLog.forEach((event, index) => { event.message = localizedLogMessage(state.log[index]); });
  const blob = new Blob([JSON.stringify({ metrics: state.metrics, log: displayLog }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zodiac-war-log.json';
  a.click();
  URL.revokeObjectURL(url);
}

setInterval(async () => {
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    const json = await res.json();
    if (json.version && json.version !== serverVersion) location.reload();
  } catch (_error) {
    // The dev watcher may restart the server between polls.
  }
}, 1000);

setInterval(() => {
  if (!state || setupPaused || state.phase !== 'mulligan' || !mulliganDeadline) return;
  const remaining = Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000));
  const timer = document.getElementById('mulliganTimerSeconds');
  if (timer) timer.textContent = String(remaining);
  if (remaining <= 0) finishMulliganTimeout();
}, 250);

function updateActionTimer() {
  const clock = document.getElementById('v10-round-clock');
  if (clock) {
    const remaining = state?.phase === 'mulligan' && mulliganDeadline
      ? Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000))
      : actionDeadline ? actionTimerRemainingSeconds() : null;
    clock.textContent = remaining === null ? '' : String(Math.floor(remaining / 60)).padStart(2, '0') + ':' + String(remaining % 60).padStart(2, '0');
  }
  if (!state || setupPaused || !actionDeadline) return;
  const remaining = actionTimerRemainingSeconds();
  const targetId = actionTimeoutTargetId();
  const badge = document.querySelector('[data-countdown-player-id="' + targetId + '"]');
  if (remaining > 0 && remaining <= 3) {
    if (badge) {
      badge.textContent = String(remaining);
      badge.classList.add('countdownUrgent');
    }
    else render();
  }
  if (remaining <= 0) finishActionTimeout();
}

setInterval(updateActionTimer, 250);
setInterval(maybeAutoAdvanceAi, 500);

document.addEventListener('dragover', updateDragGuide);
document.addEventListener('mousemove', updateSelectedCardGuide);
document.addEventListener('click', (event) => {
  if (!selectedCard) return;
  if (event.target.closest('.card') || event.target.closest('.seatCard')) return;
  if (event.target.closest('.v10-nav, .v10-report-button, .v10-dialog-backdrop, .v10-log-backdrop, .playerInspectorBackdrop')) return;
  clearSelectedCard();
});
document.addEventListener('drop', clearCardDrag);
document.addEventListener('dragend', clearCardDrag);
window.addEventListener('resize', () => {
  updatePersistentActionGuide();
  syncHandStacking();
});

window.addEventListener('game-language-change', () => {
  // Rendering keeps selected card/skill IDs, payment drafts, menus and the match.
  render();
  window.GameI18n?.localize(document.body);
  requestAnimationFrame(syncHandStacking);
});

setupSelectors();
api('/api/state');
