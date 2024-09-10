<script lang="ts">
  import { flyAndScale } from "$lib/utils/transitions";
  import { LinkPreview } from "bits-ui";
  import { getPositionSuffix } from "$lib/utils/get-position-suffix";

  export let name: string;
  export let avatar: string;
  export let position: number;
  export let points: number;
  export let constructorBet: string;
</script>

<LinkPreview.Root>
  <LinkPreview.Trigger>
    <img
      class="w-8 h-8 min-w-8 rounded-full border border-slate-600 object-cover"
      src={avatar}
      alt=""
    />
  </LinkPreview.Trigger>

  <LinkPreview.Content
    transition={flyAndScale}
    sideOffset={8}
    side="right"
    class="bg-neutral-50 shadow-lg w-[300px] border-neutral-200 border rounded-md overflow-hidden p-4"
  >
    <div class="flex gap-4">
      <img
        class="w-14 h-14 rounded-full border border-slate-600 object-cover"
        src={avatar}
        alt=""
      />
      <div>
        <div>
          <div class="text-lg font-bold leading-5">{name}</div>
          <div class="text-neutral-500">
            {position}{getPositionSuffix(position)} place · {points}pts
          </div>
        </div>
        <div class="text-sm text-neutral-500">{constructorBet} supporter</div>
      </div>
    </div>
  </LinkPreview.Content>
</LinkPreview.Root>
