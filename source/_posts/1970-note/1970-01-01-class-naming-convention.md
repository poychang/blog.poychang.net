---
layout: post
title:  類別的命名慣例
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Develop]
permalink: class-naming-convention/
---

參考一定程度的程式命名慣例，能幫助我們更好的維護程式碼。

# 管理類命名

寫程式碼，少不了對統一資源的管理，清晰的啟動過程可以有效的組織程式碼。為了讓程式運行起來，少不了各種資源的註冊、調度，少不了公共集合資源的管理。

## Bootstrap、Starter

一般作為程序啟動器使用，或者作為啟動器的基類。通俗來說，可以認為是 `main` 函數的入口。

```
AbstractBootstrap
ServerBootstrap
MacosXApplicationStarter
DNSTaskStarter
```

## Processor

某一類功能的處理器，用來表示某個處理過程，是一系列程式碼片段的集合。如果你不知道一些順序類的程式碼怎麼命名，就可以使用它，顯得高大上一些。

```
CompoundProcessor
BinaryComparisonProcessor
DefaultDefaultValueProcessor
```

## Manager

對有生命狀態的對象進行管理，通常作為某一類資源的管理入口。

```
AccountManager
DevicePolicyManager
TransactionManager
```

## Holder

表示持有某個或者某類物件的引用，並可以對其進行統一管理。多見於不好回收的記憶體統一處理，或者一些全域集合容器的緩存。

```
QueryHolder
InstructionHolder
ViewHolder
```

## Factory

毫無疑問，工廠模式的命名，耳熟能詳。尤其是 `Spring` 中，多不勝數。

```
SessionFactory
ScriptEngineFactory
LiveCaptureFactory
```

## Provider

Provider = Strategy + Factory Method。它更高級一些，把策略模式和方法工廠揉在了一塊，讓人用起來很順手。`Provider` 一般是介面或者抽象類，以便能夠完成子實現。

```
AccountFeatureProvider
ApplicationFeatureProviderImpl
CollatorProvider
```

## Registrar

註冊並管理一系列資源。

```
ImportServiceRegistrar
IKryoRegistrar
PipelineOptionsRegistrar
```

## Engine

一般是核心模組，用來處理一類功能。引擎是個非常高級的名詞，一般的類是沒有資格用它的。

```
ScriptEngine
DataQLScriptEngine
C2DEngine
```

## Service

某個服務。太簡單，不忍舉例。範圍太廣，不要濫用哦。

```
IntegratorServiceImpl
ISelectionService
PersistenceService
```

## Task

某個任務。通常是個runnable

```
WorkflowTask
FutureTask
ForkJoinTask
```

# 傳播類命名

為了完成一些統計類或者全域類的功能，有些參數需要一傳到底。傳播類的物件就可以通過統一封裝的方式進行傳遞，並在合適的地方進行拷貝或者更新。

## Context

如果你的程序執行，有一些變數，需要從函數執行的入口開始，一直傳到大量子函數執行完畢之後。這些變數或者集合，如果以參數的形式傳遞，將會讓程式碼變得冗長無比。這個時候，你就可以把變數統一塞到 `Context` 裡面，以單個物件的形式進行傳遞。

在Java中，由於ThreadLocal的存在，Context甚至可以不用在參數之間進行傳遞。

```
AppContext
ServletContext
ApplicationContext
```

## Propagator

傳播，繁殖。用來將 `context` 中傳遞的值進行複製，添加，清除，重置，檢索，恢復等動作。通常，它會提供一個叫做 `propagate` 的方法，實現真正的變數管理。

```
TextMapPropagator
FilePropagator
TransactionPropagator
```

# 回調類命名

使用多核可以增加程序運行的效率，不可避免的引入異步化。我們需要有一定的手段，獲取異步任務執行的結果，對任務執行過程中的關鍵點進行檢查。回調類 API 可以通過監聽、通知等形式，獲取這些事件。

## Handler、Callback、Trigger、Listener

`Callback` 通常是一個介面，用於響應某類消息，進行後續處理。`Handler` 通常表示持有真正消息處理邏輯的物件，它是有狀態的。`Trigger` 觸發器代表某類事件的處理，屬於 `Handler`，通常不會出現在類的命名中。`Listener` 的應用更加局限，通常在觀察者模式中用來表示特定的含義。

```
ChannelHandler
SuccessCallback
CronTrigger
EventListener
```

## Aware

Aware 就是感知的意思，一般以該單詞結尾的類，都實現了 Aware 介面。拿 spring 來說，Aware 的目的是為了讓 bean 獲取 spring 容器的服務。具體回調方法由子類實現，比如`ApplicationContextAware`。它有點回調的意思。

```
ApplicationContextAware
ApplicationStartupAware
ApplicationEventPublisherAware
```

# 監控類命名

現在的程式都比較複雜，運行狀態監控已經成為居家必備之良品。監控數據的收集往往需要侵入到程序的邊邊角角，如何有效的與正常業務進行區分，是非常有必要的。

## Metric

表示監控數據。不要用Monitor了，比較醜。

```
TimelineMetric
HistogramMetric
Metric
```

## Estimator

估計，統計。用於計算某一類統計數值的計算機。

```
ConditionalDensityEstimator
FixedFrameRateEstimator
NestableLoadProfileEstimator
```

## Accumulator

累加器的意思。用來緩存累加的中間計算結果，並提供讀取通道。

```
AbstractAccumulator
StatsAccumulator
TopFrequencyAccumulator
```

## Tracker

一般用於記錄日誌或者監控值，通常用於 apm 中。

```
VelocityTracker
RocketTracker
MediaTracker
```

# 記憶體管理類命名

如果你的應用用到了自定義的記憶體管理，那麼下面這些名詞是繞不開的。比如 Netty，就實現了自己的記憶體管理機制。

## Allocator

與存儲相關，通常表示記憶體分配器或者管理器。如果你得程式需要申請有規律得大塊記憶體，allocator 是你得不二選擇。

```
AbstractByteBufAllocator
ArrayAllocator
RecyclingIntBlockAllocator
```

## Chunk

表示一塊記憶體。如果你想要對一類存儲資源進行抽象，並統一管理，可以採用它。

```
EncryptedChunk
ChunkFactory
MultiChunk
```

## Arena

英文是舞台、競技場的意思。由於 Linux 把它用在記憶體管理上揚光大，它普遍用於各種存儲資源的申請、釋放與管理。為不同規格的存儲 chunk 提供舞臺，好像也是非常形象的表示。

關鍵是，這個詞很美，作為後綴讓類名顯得很漂亮。

BookingArena
StandaloneArena
PoolArena

## Pool

表示池子。記憶體池，線程池，連接池，池池可用。

```
ConnectionPool
ObjectPool
MemoryPool
```

# 過濾檢測類命名

程式收到的事件和資訊是非常多的，有些是合法的，有些需要過濾扔掉。根據不同的使用範圍和功能性差別，過濾操作也有多種形式。你會在框架類程式碼中發現大量這樣的名詞。

## Pipeline、Chain

一般用在責任鏈模式中。Netty，Spring MVC，Tomcat 等都有大量應用。通過將某個處理過程加入到責任鏈的某個位置中，就可以接收前面處理過程的結果，強制添加或者改變某些功能。就像 Linux 的管道操作一樣，最終構造出想要的結果。

```
Pipeline
ChildPipeline
DefaultResourceTransformerChain
FilterChain
```

## Filter

過濾器，用來篩選某些滿足條件的數據集，或者在滿足某些條件的時候執行一部分邏輯。如果和責任鏈連接起來，則通常能夠實現多級的過濾。

```
FilenameFilter
AfterFirstEventTimeFilter
ScanFilter
```

## Interceptor

攔截器，其實和 Filter 差不多。不過在 Tomcat 中，Interceptor 可以拿到 controller 物件，但 filter 不行。攔截器是被包裹在篩檢程式中。

```
HttpRequestInterceptor
```

## Evaluator

英文里是評估器的意思。可用於判斷某些條件是否成立，一般內部方法會返回 `bool` 類型。比如你傳遞進去一個非常複雜的物件，或者字串，進行正確與否的判斷。

```
ScriptEvaluator
SubtractionExpressionEvaluator
StreamEvaluator
```

## Detector

探測器。用來管理一系列探測性事件，並在發生的時候能夠進行捕獲和回應。比如 Android 的手勢檢測，溫度檢測等。

```
FileHandlerReloadingDetector
TransformGestureDetector 
ScaleGestureDetector
```

# 結構類命名

除了基本的數據結構，如數位、鏈表、佇列、棧等，其他更高一層的常見抽象類，能夠大量減少大家的交流，並能封裝常見的變化。

## Cache

這個沒啥好說的，就是緩存。大塊的緩存。常見的緩存演算法有 LRU、LFU、FIFO 等。

```
LoadingCache
EhCacheCache
```

## Buffer

buffer 是緩衝，不同於緩存，它一般用在數據寫入階段。

```
ByteBuffer
RingBuffer
DirectByteBuffer
```

## Composite

將相似的元件進行組合，並以相同的介面或者功能進行暴露，消費者不知道這到底是一個組合體還是其他個體。

```
CompositeData
CompositeMap
ScrolledComposite
```

## Wrapper

用來包裝某個物件，做一些額外的處理，以便增加或者去掉某些功能。

```
IsoBufferWrapper
ResponseWrapper
MavenWrapperDownloader 
```

## Option、Param、Attribute

用來表示配置資訊。說實話，它和 Properties 的區別並不大，但由於 Option 通常是一個類，所以功能可以擴展的更強大一些。它通常比 Config 的級別更小，關注的也是單個屬性的值。 Param 一般是作為參數存在，物件生成的速度要快一些。

```
SpecificationOption
SelectOption
AlarmParam
ModelParam
```

## Tuple

元組的概念。由於 Java 中缺乏元組結構，我們通常會自定義這樣的類。

```
Tuple2
Tuple3
```

## Aggregator

聚合器，可以做一些聚合計算。比如分庫分表中的 `sum()`、`max()`、`min()` 等聚合函數的彙集。

```
BigDecimalMaxAggregator
PipelineAggregator
TotalAggregator
```

## Iterator

反覆運算器。可以實現 Java 的反覆運算器介面，也可以有自己的反覆運算方式。在數據集很大的時候，需要進行深度遍歷，反覆運算器可以說是必備的。使用反覆運算器還可以在反覆運算過程中安全的刪除某些元素。

```
BreakIterator
StringCharacterIterator
```

## Batch

某些可以批量執行的請求或者物件。

```
SavedObjectBatch
BatchRequest
```

## Limiter

限流器，使用漏桶演算法或者令牌桶來完成平滑的限流。

```
DefaultTimepointLimiter
RateLimiter
TimeBasedLimiter
```

# 常見設計模式命名

設計模式是名詞的重災區，這裡只列出最常使用的幾個。

## Strategy

將抽象部分與它的實現部分分離，使它們都可以獨立地變化。策略模式。相同介面，不同實現類，同一方法結果不同，實現策略不同。比如一個配置檔，是放在 xml 裡，還是放在 json 檔裡，都可以使用不同的 provider 去命名。

```
RemoteAddressStrategy
StrategyRegistration
AppStrategy
```

## Adapter

將一個類的介面轉換為客戶希望的另一個介面，Adapter 模式使得原本由於介面不相容而不能一起工作的那些類一起工作。

不過，相對於傳統的適配器進行 API 轉接，如果你的某個 Handler 裡面方法特別的多，可以使用Adapter實現一些預設的方法進行0適配。那麼其他類使用的時候，只需要繼承 Adapter，然後重寫他想要重寫的方法就可以了。這也是 Adapter 的常見用法。

```
ExtendedPropertiesAdapter
ArrayObjectAdapter
CardGridCursorAdapter
```

## Action、Command

將一個請求封裝為一個對象，從而使你可用不同的請求對客戶進行參數化，對請求排隊或記錄請求日誌，以及支援可撤銷的操作。

用來表示一系列動作指令，用來實現命令模式，封裝一系列動作或者功能。Action 一般用在 UI 操作上，後端框架可以無差別的使用。

在 DDD 的概念中，CQRS 的 Command 的 C，既為 Command。

```
DeleteAction
BoardCommand
```

## Event

表示一系列事件。一般的，在語義上，Action、Command 等，來自於主動觸發。Event 來自於被動觸發。

```
ObservesProtectedEvent
KeyEvent
```

## Delegate

代理或者委託模式。委託模式是將一件屬於委託者做的事情，交給另外一個被委託者來處理。

```
LayoutlibDelegate
FragmentDelegate
```

## Builder

將一個複雜對象的構建與它的表示分離，使得同樣的構建過程可以創建不同的表示。

構建者模式的標準命名。比如 StringBuilder。當然 StringBuffer 是個另類。這也說明瞭，規則是人定的，人也可以破壞。

```
JsonBuilder
RequestBuilder
```

## Template

範本方法類的命名。定義一個操作中的演算法的骨架，而將一些步驟延遲到子類中。範本方法使得子類可以不改變一個演算法的結構即可重定義該演算法的某些特定步驟。

```
JDBCTemplate
```

## Proxy

代理模式。為其他物件提供一種代理以控制對這個物件的訪問。

```
ProxyFactory
SlowQueryProxy
```

# 解析類命名

寫程式碼要涉及到大量的字串解析、日期解析、物件轉換等。根據語義和使用場合的區別，它們也分為多種。

## Converter、Resolver

轉換和解析。一般用於不同對象之間的格式轉換，把一類對象轉換成另一類。注意它們語義上的區別，一般特別複雜的轉換或者有載入過程的需求，可以使用 Resolver。

```
DataSetToListConverter
LayoutCommandLineConverter
InitRefResolver
MustacheViewResolver
```

## Parser

用來表示非常複雜的解析器，比如解析 DSL。

```
SQLParser
JSONParser
```

## Customizer

用來表示對某個物件進行特別的配置。由於這些配置過程特別的複雜，值得單獨提取出來進行自定義設置。

```
ContextCustomizer
DeviceFieldCustomizer
```

## Formatter

格式化類。主要用於字串、數位或者日期的格式化處理工作。

```
DateFormatter
StringFormatter
```

# 網路類命名

網路程式設計的同學，永遠繞不過去的幾個名詞。

## Packet

通常用於網路程式設計中的數據包。

```
DhcpPacket
PacketBuffer
```

## Protocol

同樣用戶網路程式設計中，用來表示某個協定。

```
RedisProtocol
HttpProtocol
```

## Encoder、Decoder、Codec

編碼解碼器

```
RedisEncoder
RedisDecoder
RedisCodec
```

## Request、Response

一般用於網路請求的進和出。如果你用在非網路請求的方法上，會顯得很怪異。

# CRUD命名

這個就有意思多了，統一的 Controller、Service、Repository，沒什麼好說的。但你一旦用了 DDD，那就得按照 DDD 那一套的命名來。

由於 DDD 不屬於通用程式設計範疇，它的名詞就不多做介紹了。

# 其他

## Util、Helper

都表示工具類，Util 一般是無狀態的，Helper 以便需要創建實例才能使用。但是一般沒有使用 Tool 作為後綴的。

```
HttpUtil
TestKeyFieldHelper
CreationHelper
```

## Mode、Type

看到 Mode 這個後綴，就能猜到這個類大概率是枚舉。它通常把常見的可能性都列到枚舉類裡面，其他地方就可以引用這個 Mode。

```
OperationMode
BridgeMode
ActionType
```

## Invoker、Invocation

invoker 是一類介面，通常會以反射或者觸發的方式，執行一些具體的業務邏輯。通過抽象出 invoke 方法，可以在 invoke 執行之前對入參進行記錄或者處理。在 invoke 執行之後對結果和異常進行處理，是 AOP 中常見的操作方式。

```
MethodInvoker
Invoker
ConstructorInvocation
```

## Initializer

如果你的應用程式，需要經過大量的初始化操作才能啟動，那就需要把它獨立出來，專門處理初始化動作。

```
MultiBackgroundInitialize
ApplicationContextInitializer
```

## Future、Promise

它們都是用在多線程之間的，進行數據傳遞。

Future 相當於一個佔位符，代表一個操作將來的結果。一般通過 get 可以直接阻塞得到結果，或者讓它異步執行然後通過 callback 回調結果。

但如果回調中嵌入了回調呢？ 如果層次很深，就是回調地獄。Java 中的 CompletableFuture 其實就是 Promise，用來解決回調地獄問題。Promise 是為了讓程式碼變得優美而存在的。

## Selector

根據一系列條件，獲得相應的同類資源。它比較像 Factory，但只處理單項資源。

```
X509CertSelector
NodeSelector
```

## Reporter

用來彙報某些執行結果。

```
ExtentHtmlReporter
MetricReporter
```

## Constants

一般用於常量清單。

## Accessor

封裝了一系列 get 和 set 方法的類。像 lombok 就有 Accessors 注解，生成這些方法。但 Accessor 類一般是要通過計算來完成 get 和 set，而不是直接操作變數。這適合比較複雜的物件存取服務。

```
ComponentAccessor
StompHeaderAccessor
```

## Generator

生成器，一般用於生成程式碼，生成 id 等。

```
CodeGenerator
CipherKeyGenerator
```

----------

參考資料：

* [优秀开源软件的类，都是怎么命名的？](https://zhuanlan.zhihu.com/p/401662799)
